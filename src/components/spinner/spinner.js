import React from 'react';
import './spinner.css';

/**
 * Spinner Component based on font awesome
 */
const Spinner = props => {
  const className = props.class ? props.class : 'my-spinner';
  return props.enabled ? (
    <div className={className}>
      <p>
        <i className="fas fa-circle-notch fa-spin" />
        <small> {props.message}</small>
      </p>
    </div>
  ) : (
    <div />
  );
};
export default Spinner;
