import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, Container } from 'reactstrap';
import './orgInput.css';

class OrgInput extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      org: this.props.org,
      enabled: false
    };
  }

  handleSubmit(event) {
    event.preventDefault();
    //  console.log('A name was submitted: ' + this.state.searchText)
  }

  handleChange = event => {
    this.setState({
      org: event.target.value
    });
  };

  handleCheck = event => {
    this.setState({
      enabled: !this.state.enabled
    });
  };

  render() {
    const { onSubmit } = this.props;
    return (
      <Container>
        <Form
          inline
          onSubmit={event => {
            event.preventDefault();
            onSubmit(this.state);
          }}
        >
          <FormGroup className="mb-2 mr-sm-2 mb-sm-0" inline>
            <Label for="orgName" className="mr-sm-2">
              Organization
            </Label>
            <Input
              type="text"
              name="orgName"
              id="orgName"
              className="my-input"
              value={this.state.org}
              placeholder="Github org name"
              onChange={this.handleChange.bind(this)}
              disabled={!this.state.enabled}
            />

            <Label check className="my-input">
              <Input
                type="checkbox"
                onChange={this.handleCheck}
                checked={this.state.enabled}
              />{' '}
              EDIT ORG
            </Label>

            <Button
              onClick={() => onSubmit(this.state)}
              disabled={!this.state.enabled}
              className="my-input"
            >
              UPDATE ORG
            </Button>
          </FormGroup>
        </Form>
      </Container>
    );
  }
}

export default OrgInput;
