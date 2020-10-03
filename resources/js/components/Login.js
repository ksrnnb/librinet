import React from 'react';
import Subtitle from './Subtitle';
const axios = window.axios;

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.login = this.props.login.bind(this);
    this.guestLogin = this.guestLogin.bind(this);
    this.normalUserLogin = this.normalUserLogin.bind(this);
  }

  guestLogin() {
    axios
      .get('/sanctum/csrf-cookie')
      .then((response) => {
        axios
          .post('/api/guest/login')
          .then((response) => {
            this.login(this.props.props);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        alert('Error happened.');
      });
  }

  normalUserLogin() {
    axios
      .get('/sanctum/csrf-cookie')
      .then((response) => {
        axios
          .post('/api/login', {
            strId: 'Qx1rsGtDn',
            password: 'password',
          })
          .then((response) => {
            this.login(this.props.props);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        alert('Error happened.');
      });
  }

  render() {
    return (
      <>
        <Subtitle subtitle="Login" />
        <div className="row">
          <button
            id="guest"
            className="btn btn-outline-success"
            onClick={this.guestLogin}
          >
            ゲストでログイン
          </button>
          <button
            className="btn btn-outline-success"
            onClick={this.normalUserLogin}
          >
            他のユーザーでログイン
          </button>
        </div>
      </>
    );
  }
}
