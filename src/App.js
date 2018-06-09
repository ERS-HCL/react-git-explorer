import React, { Component } from 'react';
import { Container, Jumbotron } from 'reactstrap';

import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import RepoContainer from './components/repoContainer';

class App extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    return (
      <div>
        {/* <Navbar color="faded" light={true} expand="md">
          <NavbarBrand href="/">reactstrap</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar={true}>
            <Nav className="ml-auto" navbar={true}>
              <NavItem>
                <NavLink href="/components/">Components</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="https://github.com/reactstrap/reactstrap">
                  Github
                </NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar> */}
        <Jumbotron fluid className="bg-muted jumbo">
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
