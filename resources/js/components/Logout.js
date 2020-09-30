import React from 'react';
const axios = window.axios;

export default class Logout extends React.Component {
  constructor(props) {
    super(props);
  }

  logout() {
    axios
      .post('/api/logout')
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <button className="btn btn-outline-danger" onClick={this.logout}>
        Log out
      </button>
    );
  }
}
