import React from 'react';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';
import { Container, Alert } from 'reactstrap';
import RepoList from './repoList';
import './repoContainer.css';
import Spinner from './spinner';
import { CSVLink } from 'react-csv';
const moment = require('moment-timezone');
moment.tz.setDefault('UTC');

const getCursorOrgData = gql`
  query($cursor: String) {
    organization(login: "ERS-HCL") {
      repositories(first: 50, after: $cursor) {
        totalCount
        pageInfo {
          endCursor
          __typename
        }
        edges {
          cursor
          node {
            name
            descriptionHTML
            license
            stargazers(first: 50) {
              totalCount
            }
            repositoryTopics(first: 20) {
              edges {
                node {
                  topic {
                    name
                  }
                }
              }
            }
            forkCount
            isFork
            createdAt
            updatedAt
            pushedAt
            homepageUrl
            url
            primaryLanguage {
              name
              color
            }
            collaborators(first: 50, affiliation: DIRECT) {
              edges {
                node {
                  name
                  login
                  avatarUrl
                }
              }
            }
          }
        }
      }
    }
  }
`;

const getOrgData = gql`
  {
    organization(login: "ERS-HCL") {
      repositories(first: 50) {
        totalCount
        pageInfo {
          endCursor
          __typename
        }
        edges {
          node {
            name
            descriptionHTML
            license
            stargazers(first: 50) {
              totalCount
            }
            repositoryTopics(first: 20) {
              edges {
                node {
                  topic {
                    name
                  }
                }
              }
            }
            forkCount
            isFork
            createdAt
            updatedAt
            pushedAt
            homepageUrl
            url
            primaryLanguage {
              name
              color
            }
            collaborators(first: 50, affiliation: DIRECT) {
              edges {
                node {
                  name
                  login
                  avatarUrl
                }
              }
            }
          }
        }
      }
    }
  }
`;

const RepoContainer = props => {
  const getContributors = contributors => {
    return contributors
      .map(edge => {
        return edge.node.name && edge.node.name.trim() !== ''
          ? edge.node.name
          : edge.node.login;
      })
      .join(',');
  };

  const getTopics = edges => {
    return edges.map(edge => {
      return edge.node.topic.name;
    });
  };

  const getPrimaryLanguage = primaryLanguage => {
    return primaryLanguage
      ? {
          name: primaryLanguage.name,
          color: primaryLanguage.color
        }
      : {
          name: 'na',
          color: 'black'
        };
  };

  const handleDownload = data => {
    return data.edges.map(repo => {
      return {
        name: repo.node.name,
        forkCount: repo.node.forkCount,
        stars: repo.node.stargazers.totalCount,
        contributors: getContributors(repo.node.collaborators.edges),
        language: getPrimaryLanguage(repo.node.primaryLanguage),
        pushedAt: repo.node.pushedAt,
        createdAt: repo.node.createdAt,
        descriptionHTML: repo.node.descriptionHTML,
        homepageUrl: repo.node.homepageUrl,
        url: repo.node.url,
        topics: getTopics(repo.node.repositoryTopics.edges),
        license: repo.node.license
      };
    });
  };

  return (
    <Query query={getOrgData}>
      {({ loading, error, data, fetchMore }) => {
        if (error) return `Error! ${error.message}`;

        const totalCount = data.organization
          ? data.organization.repositories.totalCount
          : 0;
        const totalCurrent = data.organization
          ? data.organization.repositories.edges.length
          : 0;
        const newCursor = data.organization
          ? data.organization.repositories.pageInfo.endCursor
          : '';
        this.showSpinner = loading ? loading : false;
        this.fetchInProgress = false;
        const csvFileName =
          'ProjectList_' + moment(new Date()).format('DD_MM_YYYY') + '.csv';
        return (
          <div>
            <RepoList
              data={data}
              onLoadMore={() => {
                if (this.fetchInProgress) {
                  return;
                }
                if (
                  totalCurrent < totalCount &&
                  (newCursor !== null || newCursor !== '')
                ) {
                  this.fetchInProgress = true;
                  fetchMore({
                    query: getCursorOrgData,
                    variables: { cursor: newCursor },
                    updateQuery: (previousResult, { fetchMoreResult }) => {
                      const newTotalCount =
                        fetchMoreResult.organization.repositories.totalCount;
                      const newPageInfo =
                        fetchMoreResult.organization.repositories.pageInfo;
                      const previousEdges =
                        previousResult.organization.repositories.edges;
                      const newEdges =
                        fetchMoreResult.organization.repositories.edges;

                      return {
                        organization: {
                          ...previousResult.organization,
                          ...fetchMoreResult.organization,
                          repositories: {
                            // Add typename for any type you are planning to update otherwise
                            // apollo client complains of __typename missing
                            __typename:
                              previousResult.organization.repositories
                                .__typename,
                            totalCount: newTotalCount,
                            pageInfo: newPageInfo,
                            edges: [...previousEdges, ...newEdges]
                          }
                        }
                      };
                    }
                  });
                } else {
                  this.fetchInProgress = false;
                  this.showSpinner = false;
                }
              }}
            />
            <Container>
              <Spinner
                enabled={
                  // Show spinner based on loading attribute and
                  // current fetch status
                  (totalCurrent > 0 && totalCurrent < totalCount) ||
                  this.showSpinner
                }
              />
              {totalCount > 0 && (
                <Alert color="light text-primary" className="my-alert">
                  {' '}
                  {totalCurrent}/{totalCount}
                  <CSVLink
                    className="my-download"
                    data={handleDownload(data.organization.repositories)}
                    filename={csvFileName}
                  >
                    <i className="fas fa-cloud-download-alt" />
                  </CSVLink>
                </Alert>
              )}
            </Container>
          </div>
        );
      }}
    </Query>
  );
};

export default RepoContainer;
