import React, { Component } from 'react';
import { Query } from 'react-apollo';
import RepoList from '../repoList/repoList';
import { GET_CURSOR_ORG_DATA, GET_ORG_DATA } from '../../graphql/queries';
import './repoContainer.css';

const moment = require('moment-timezone');
moment.tz.setDefault('UTC');

class RepoContainer extends Component {
  render() {
    //  const org = 'facebook';
    //const variables = { $org: 'facebook' };
    const { org } = this.props;
    return (
      <Query query={GET_ORG_DATA} variables={{ org: org }} errorPolicy="ignore">
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
          return (
            <div>
              <RepoList
                data={data}
                totalCurrent={totalCurrent}
                totalCount={totalCount}
                showSpinner={loading}
                fetchInProgress={this.fetchInProgress}
                onLoadMore={() => {
                  // Multiple scroll up and down can cause duplicate calls
                  // Ignore additional calls while there is a fetch in progress
                  if (this.fetchInProgress) {
                    return Promise.resolve(false);
                  }
                  if (
                    totalCurrent < totalCount &&
                    (newCursor !== null || newCursor !== '')
                  ) {
                    this.fetchInProgress = true;
                    return fetchMore({
                      query: GET_CURSOR_ORG_DATA,
                      errorPolicy: 'ignore',
                      variables: { cursor: newCursor, org: org },
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
                    return Promise.resolve(true);
                  }
                }}
              />
            </div>
          );
        }}
      </Query>
    );
  }
}

export default RepoContainer;
