import React, { Component } from 'react';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';
import GitCards from './gitCards';
import { Button, Container } from 'reactstrap';
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

class RepoList extends Component {
  state = {
    fetching: false
  }
  render() {
    return (
      <Query query={getOrgData}>
        {({ loading, error, data, fetchMore }) => {
          if (loading)
            return (
              <Container>
                <i className="fa fa-refresh fa-spin my-spinner" />
              </Container>
            );
          if (error) return `Error! ${error.message}`;
          //  console.log(data.organization);
          // const repoList = data.organization.repositories.edges;
          //  console.log(repoList);
          const totalCount = data.organization.repositories.totalCount;
          const totalCurrent = data.organization.repositories.edges.length;
          const newCursor = data.organization.repositories.pageInfo.endCursor;

          // There are more repositories available
          const hasMoreData = () => {
            return !(
              !this.state.fetching &&
              totalCurrent < totalCount &&
              (newCursor !== null || newCursor !== '')
            );
          };

          const onFetchMore = newCursor => {
            this.setState({
              fetching: true
            })
            if (newCursor === null || newCursor === '') return;
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
               // console.log(newData, newCursor);
                this.setState({
                  fetching: false
                })
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
          };

          return (
            <Container>
              <GitCards repositories={data.organization.repositories} />
              <div>
                <hr className="my-hr" size="30" />
                <Button
                  disabled={hasMoreData()}
                  onClick={() => onFetchMore(newCursor)}
                  color="success"
                  className="my-button"
                >
                  MORE PROJECTS
                </Button>
                <Button disabled={true} color="success" className="my-button">{totalCurrent}/{totalCount}</Button>
                {(this.state.fetching === true)?<i className="fa fa-refresh fa-spin my-spinner" />:undefined}
              </div>
            </Container>
          );
        }}
      </Query>
    );
  }
}

export default RepoList;
