import React from 'react';
import './spinner.css';

const Spinner = props =>
  props.enabled ? (
    <div className="my-spinner">
      <i className="fas fa-circle-notch fa-spin my-spinner" />
    </div>
  ) : (
    <div />
  );

export default Spinner;
