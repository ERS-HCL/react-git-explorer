import React, { Component } from 'react';
import { Container, Jumbotron } from 'reactstrap';

import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import RepoContainer from './components/repoContainer';

class App extends Component {
  render() {
    return (
      <div>
        <Jumbotron fluid className="jumbo">
          <Container fluid>
            <h1 className="display-3">ERS HCL Github Stats</h1>
            <p className="lead">
              ERS HCL Organization Open Source project statistics..
            </p>
          </Container>
        </Jumbotron>
        <RepoContainer />
      </div>
    );
  }
}

export default App;
