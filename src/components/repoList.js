import React, { Component } from 'react';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';
import './repoList.css';

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
                }
              }
            }
          }
        }
      }
    }
  }
`;

class RepoList extends Component {
  render() {
    return (
      <Query query={getOrgData}>
        {({ loading, error, data, fetchMore }) => {
          if (loading) return 'Loading...';
          if (error) return `Error! ${error.message}`;
          console.log(data.organization);
          const repoList = data.organization.repositories.edges;
          console.log(repoList);
          const repoDisplay = repoList.map(item => (
            <li key={item.node.name}>{item.node.name}</li>
          ));
          const totalCount = data.organization.repositories.totalCount;

          const newCursor = data.organization.repositories.pageInfo.endCursor;
          const hasMoreData: boolean = (data,totalCount,cursor) => {
            return (data.length === totalCount || newCursor === null || newCursor === '')
          }

          const onFetchMore = newCursor => {
            if (newCursor === null || newCursor === '')
                return
            fetchMore({
              query: getCursorOrgData,
              variables: { cursor: newCursor },
              updateQuery: (previousResult, { fetchMoreResult }) => {
                const newData = fetchMoreResult.organization.repositories;
                const newCursor =
                  fetchMoreResult.organization.repositories.pageInfo.endCursor;
                const newTotalCount =
                    fetchMoreResult.organization.repositories.totalCount;
                const newPageInfo =
                  fetchMoreResult.organization.repositories.pageInfo;
                const previousEdges =
                  previousResult.organization.repositories.edges;
                const newEdges =
                  fetchMoreResult.organization.repositories.edges;
                console.log(newData, newCursor);
                return {
                  organization: {
                    ...previousResult.organization,
                    ...fetchMoreResult.organization,
                   repositories: {
                       // Add typename for any type you are planning to update otherwise 
                       // apollo client complains of __typename missing
                        __typename: previousResult.organization.repositories.__typename,
                        totalCount: newTotalCount,
                        pageInfo: newPageInfo,
                        edges: [...previousEdges, ...newEdges]
                      }
                  }
                };
              }
            });
          };

          return (
            <div>
              <ul>{repoDisplay}</ul>
              <button onClick={() => onFetchMore(newCursor)}>
                Fetch More Matches
              </button>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default RepoList;
