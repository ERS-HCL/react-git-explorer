import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
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
            placeholder="Github organization name"
            onChange={this.handleChange.bind(this)}
            disabled={!this.state.enabled}
          />

          <Label check>
            <Input
              type="checkbox"
              onChange={this.handleCheck}
              checked={this.state.enabled}
            />{' '}
            EDIT ORG
          </Label>
        </FormGroup>
        <Button
          onClick={() => onSubmit(this.state)}
          disabled={!this.state.enabled}
        >
          UPDATE ORG
        </Button>
      </Form>
    );
  }
}

export default OrgInput;