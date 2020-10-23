import React from 'react';
import { PropTypes } from 'prop-types';

export default function Subtitle(props) {
  return (
    <h3 className="mb-3" id="subtitle">
      {props.subtitle}
    </h3>
  );
}

Subtitle.propTypes = {
  subtitle: PropTypes.string,
};
