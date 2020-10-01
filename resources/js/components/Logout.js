import React from 'react';
import Subtitle from './Subtitle';
const axios = window.axios;

export default function logout(props) {
  return (
    <>
      <Subtitle subtitle="Logout" />
      <button className="btn btn-outline-danger" onClick={() => props.logout(props.props)}>
        Log out
      </button>
    </>
  );
}
