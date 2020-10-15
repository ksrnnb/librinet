import React from 'react';
import { PropTypes } from 'prop-types';

export default function Subtitle(props) {
  return <h2>{props.subtitle}</h2>;
}

Subtitle.propTypes = {
  subtitle: PropTypes.string,
};
