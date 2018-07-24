import React from 'react';
import './gitDecorators.css';

const moment = require('moment-timezone');
moment.tz.setDefault('UTC');
/**
 * Github Stats decorator Component based on font awesome
 */
const GitDecorators = props => {
  const stars =
    props.stars && props.stars > 0 ? (
      <div className="my-decorator text-muted">
        <i className="fas fa-star my-icon text-success" /> {props.stars}
      </div>
    ) : (
      undefined
    );
  const forks =
    props.forks && props.forks > 0 ? (
      <div className="my-decorator text-muted">
        <i className="fas fa-code-branch my-icon" /> {props.forks}
      </div>
    ) : (
      undefined
    );
  const license = props.license ? (
    <div className="my-decorator text-muted">
      <i className="fas fa-address-card my-icon" /> {props.license}
    </div>
  ) : (
    undefined
  );
  const creationDate = props.created ? (
    <div className="my-decorator text-muted">
      <i className="fas fa-calendar my-icon text-info" />{' '}
      {moment.utc(props.created).format('Do MMM YY')}
    </div>
  ) : (
    undefined
  );
  const pushedDate = props.pushed ? (
    <div className="my-decorator text-muted">
      <i className="fas fa-edit my-icon text-danger" />{' '}
      {moment.utc(props.pushed).fromNow()}
    </div>
  ) : (
    undefined
  );
  return (
    <div>
      <div className="my-star">
        {stars} {forks} {license}
      </div>
      <div className="my-star">
        {creationDate} {pushedDate}
      </div>
    </div>
  );
};
export default GitDecorators;
