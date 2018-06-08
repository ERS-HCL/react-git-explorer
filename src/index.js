import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.css';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

const client = new ApolloClient({
  uri: 'https://api.github.com/graphql',
  fetchOptions: {
    credentials: 'include'
  },
  request: async operation => {
    const token = 'Bearer a64072f374f7b446a67fd2eb7c6536d68ed5b247';
    operation.setContext({
      headers: {
        authorization: token
      }
    });
  },
  onError: ({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      console.log(graphQLErrors);
    }
    if (networkError) {
      console.log(networkError);
    }
  }
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);
registerServiceWorker();
