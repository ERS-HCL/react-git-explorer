import React, { Component } from 'react';
import {
  Col,
  Container,
  Jumbotron,
  Row
} from 'reactstrap';


import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import RepoList from './components/repoList'

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
        <Jumbotron>
          <Container>
            <Row>
              <Col>
                <h1>ERS HCL Github Stats</h1>
{/*                 <p>
                  <Button
                    tag="a"
                    color="success"
                    size="large"
                    href="http://reactstrap.github.io"
                    target="_blank"
                  >
                    View Reactstrap Docs
                  </Button>
                </p> */}
              </Col>
            </Row>
          </Container>
        </Jumbotron>
        <RepoList/>
      </div>
    );
  }
}

export default App;
