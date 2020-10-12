import React, { useState } from 'react';
import Subtitle from './Subtitle';
const axios = window.axios;

export default function Login(props) {
  const [strId, setStrId] = useState('');
  const [password, setPassword] = useState('');

  function guestLogin() {
    axios
      .get('/sanctum/csrf-cookie')
      .then((response) => {
        axios
          .post('/api/guest/login')
          .then((response) => {
            console.log(response);
            props.login(props.props);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        alert('Error happened.');
      });
  }

  function normalUserLogin() {
    axios
      .get('/sanctum/csrf-cookie')
      .then((response) => {
        axios
          .post('/api/login', {
            strId: strId,
            password: password,
          })
          .then((response) => {
            console.log(response);
            // props.login(props.props);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        alert('Error happened.');
      });
  }

  return (
    <>
      <Subtitle subtitle="Login" />
      <div className="d-block row">
        <div>
          <button
            id="guest"
            className="btn btn-outline-success"
            onClick={guestLogin}
          >
            ゲストでログイン
          </button>
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-12">
          <form>
            <label htmlFor="user-id" className="d-block">
              ユーザーID
              <input
                name="user-id"
                id="user-id"
                className="d-block"
                value={strId}
                onChange={(e) => setStrId(e.target.value)}
              />
            </label>
            <label htmlFor="password" className="d-block">
              パスワード
              <input
                type="password"
                name="password"
                id="password"
                autoComplete="off"
                className="d-block"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          </form>
          <button
            type="button"
            id="normal-login"
            className="btn btn-outline-success d-block"
            onClick={normalUserLogin}
          >
            ログイン
          </button>
        </div>
      </div>
    </>
  );
}
