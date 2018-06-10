import React from 'react';
import { Container } from 'reactstrap';
import './spinner.css';

const Spinner = props =>
  props.enabled ? (
    <Container className="my-spinner">
      <i className="fas fa-circle-notch fa-spin my-spinner" />
    </Container>
  ) : (
    <div />
  );

export default Spinner;
