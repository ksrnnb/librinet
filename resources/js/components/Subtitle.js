import React from 'react';
import { PropTypes } from 'prop-types';

export default function Subtitle(props) {
  return (
    <div className="col-12 px-0">
      <h3 className="mb-3" id="subtitle">
        {props.subtitle}
      </h3>
    </div>
  );
}

Subtitle.propTypes = {
  subtitle: PropTypes.string,
};
