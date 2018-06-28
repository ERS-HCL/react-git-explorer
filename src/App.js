import React, { Component } from 'react';
import { Container, Jumbotron, Nav, NavLink, NavItem } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import RepoContainer from './components/repoContainer/repoContainer';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import Spinner from './components/spinner/spinner';
import GithubCorner from './components/githubCorner/githubCorner';

const STATUS = {
  INITIAL: 'initial',
  LOADING: 'loading',
  FINISHED_LOADING: 'finished_loading',
  AUTHENTICATED: 'authenticated'
};

class App extends Component {
  state = {
    status: STATUS.INITIAL,
    token: null
  };

  componentDidMount() {
    const code =
      window.location.href.match(/\?code=(.*)/) &&
      window.location.href.match(/\?code=(.*)/)[1];
    if (code) {
      this.setState({ status: STATUS.LOADING });
      fetch(`${process.env.REACT_APP_GATEKEEPER_URI}/authenticate/${code}`)
        .then(response => response.json())
        .then(({ token }) => {
          if (token) {
            this.setState({
              token,
              status: STATUS.AUTHENTICATED
            });
          } else {
            this.setState({
              token: undefined,
              status: STATUS.INITIAL
            });
          }
        });
    }
  }

  render() {
    const client =
      this.state.token &&
      new ApolloClient({
        uri: 'https://api.github.com/graphql',
        fetchOptions: {
          credentials: 'include'
        },
        request: async operation => {
          const token = 'Bearer ' + this.state.token;
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

    const loginPrompt = this.state.status === STATUS.INITIAL && (
      <div>
        <hr className="my-2" />

        <p className="text-muted lead-2">
          You need to first login in with your Github credentials to view the
          statistics{' '}
        </p>

        <Nav pills>
          <NavItem>
            <NavLink
              href={`https://github.com/login/oauth/authorize?client_id=${
                process.env.REACT_APP_CLIENT_ID
              }&scope=public_repo&redirect_uri=${
                process.env.REACT_APP_REDIRECT_URI
              }`}
              className="btn btn-secondary float-left"
              active
            >
              GITHUB LOGIN
            </NavLink>
          </NavItem>
        </Nav>
      </div>
    );
    const loginStatus = (
      <div>
        {this.state.status === STATUS.LOADING && (
          <div>
            <hr className="my-2" />
            <p className="text-info">Authenticating ..</p>
          </div>
        )}
      </div>
    );

    return (
      <div>
        <GithubCorner githubUrl="https://github.com/ERS-HCL/react-git-explorer" />
        <Jumbotron fluid className="jumbo">
          <Container fluid>
            <h1 className="display-4">
              <img
                src="https://avatars2.githubusercontent.com/u/32506169?s=400&u=68132b5e3e0ace90c5411c436e521bf718d454e1&v=4"
                alt="Avatar"
                className="avatar1"
              />
              ERS HCL Github Stats
            </h1>
            <p className="lead-2">
              ERS HCL Organization Open Source project statistics..
            </p>
            {loginPrompt}
            {loginStatus}
            <Spinner
              enabled={this.state.status === STATUS.LOADING}
              class={'spinner-black'}
            />
          </Container>
        </Jumbotron>

        {client && (
          <ApolloProvider client={client}>
            <RepoContainer />
          </ApolloProvider>
        )}
      </div>
    );
  }
}

export default App;
