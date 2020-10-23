import React from 'react';
import PropTypes from 'prop-types';

export function MyCard(props) {
  const className = props.addingClass
    ? 'my-card row shadow no-gutters ' + props.addingClass
    : 'my-card row shadow no-gutters';

  const attr = props.onClick && { onClick: props.onClick };

  return (
    <div className={className} {...attr}>
      <div className="col-3 image">{props.image}</div>
      <div className="col body">{props.body}</div>
    </div>
  );
}

MyCard.propTypes = {
  image: PropTypes.object,
  body: PropTypes.object,
  onClick: PropTypes.func,
  addingClass: PropTypes.string,
};
