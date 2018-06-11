import React from 'react';
import { Query } from 'react-apollo';
import { Container, Alert } from 'reactstrap';
import { CSVLink } from 'react-csv';
import RepoList from '../repoList/repoList';
import Spinner from '../spinner/spinner';
import { GET_CURSOR_ORG_DATA, GET_ORG_DATA } from '../../graphql/queries';
import './repoContainer.css';

const moment = require('moment-timezone');
moment.tz.setDefault('UTC');

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

  /**
   * Tranform the github data to a csv compiliant format
   */
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
    <Query query={GET_ORG_DATA}>
      {({ loading, error, data, fetchMore }) => {
        if (error) return `Error! ${error.message}`;

        // Total available org repositories
        const totalCount = data.organization
          ? data.organization.repositories.totalCount
          : 0;
        // Currently available org repositories
        const totalCurrent = data.organization
          ? data.organization.repositories.edges.length
          : 0;
        // New Cursor
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
                // Multiple scroll up and down can cause duplicate calls
                // Ignore additional calls while there is a fetch in progress
                if (this.fetchInProgress) {
                  return;
                }
                if (
                  totalCurrent < totalCount &&
                  (newCursor !== null || newCursor !== '')
                ) {
                  this.fetchInProgress = true;
                  fetchMore({
                    query: GET_CURSOR_ORG_DATA,
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
                            // Append new repositories to the end
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
                  <i>
                    <small>
                      <strong>
                        {totalCurrent}/{totalCount}
                      </strong>
                    </small>
                  </i>
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
