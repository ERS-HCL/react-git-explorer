import { gql } from 'apollo-boost';

const GET_CURSOR_ORG_DATA = gql`
  query($cursor: String, $org: String = "") {
    organization(login: $org) {
      repositories(
        first: 50
        after: $cursor
        orderBy: { field: PUSHED_AT, direction: DESC }
      ) {
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

const GET_ORG_DATA = gql`
  query($org: String = "") {
    organization(login: $org) {
      repositories(first: 50, orderBy: { field: PUSHED_AT, direction: DESC }) {
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

export { GET_CURSOR_ORG_DATA, GET_ORG_DATA };
