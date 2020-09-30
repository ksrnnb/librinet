import React from 'react';
const axios = window.axios;

export default Login;

function Login() {
  return (
    <div className="row">
      <button
        id="guest"
        className="btn btn-outline-success"
        onClick={guestLogin}
      >
        ゲストでログイン
      </button>
      <button className="btn btn-outline-success" onClick={normalUserLogin}>
        他のユーザーでログイン
      </button>
    </div>
  );
}

function guestLogin() {
  axios
    .get('/sanctum/csrf-cookie')
    .then((response) => {
      axios
        .post('/api/guest/login')
        .then((response) => {
          axios.get('/home');
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
          strId: '7e05bYfC',
          password: 'password',
        })
        .then((response) => {
          axios.get('/home');
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      alert('Error happened.');
    });
}
