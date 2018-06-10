import React from 'react';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';
import RepoList from './repoList';
import './repoContainer.css';
import Spinner from './spinner';
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

  return (
    <Query query={getOrgData} >
      {({ loading, error, data, fetchMore }) => {
    
        if (error) return `Error! ${error.message}`;
        
        const totalCount = (data.organization)?data.organization.repositories.totalCount:0;
        const totalCurrent = (data.organization)?data.organization.repositories.edges.length:0;
        const newCursor = (data.organization)?data.organization.repositories.pageInfo.endCursor:'';
        this.showSpinner = (loading)?loading:false;
        this.fetchInProgress=false;
        return (
          <div>
          <RepoList
            data={data}
            onLoadMore={() => {
              if (this.fetchInProgress) {
                return
              }
              if (
                totalCurrent < totalCount &&
                (newCursor !== null || newCursor !== '')
              ) {
                this.fetchInProgress=true;
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
                            previousResult.organization.repositories.__typename,
                          totalCount: newTotalCount,
                          pageInfo: newPageInfo,
                          edges: [...previousEdges, ...newEdges]
                        }
                      }
                    };
                  }
                });
              } else {
                this.fetchInProgress=false;
                this.showSpinner=false;
              }
            }}
          />
          <Spinner enabled={(totalCurrent > 0 && totalCurrent < totalCount) || this.showSpinner} />
          </div>
        );
      }}
    </Query>
  );
};

export default RepoContainer;
