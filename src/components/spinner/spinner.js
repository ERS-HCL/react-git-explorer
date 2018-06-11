import React from 'react';
import './spinner.css';

/**
 * Spinner Component based on font awesome
 */
const Spinner = props => {
  const className =props.class?props.class: 'my-spinner';
  return props.enabled ? (
    <div className={className}>
      <i className="fas fa-circle-notch fa-spin" />
    </div>
  ) : (
    <div />
  );
}
export default Spinner;
