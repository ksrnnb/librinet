import React, { useContext } from 'react';
import { SetStateContext } from './App';
import { PropsContext } from './Pages';
import Subtitle from './Subtitle';

const axios = window.axios;

export default function logout() {
  const props = useContext(PropsContext);
  const setState = useContext(SetStateContext);

  function onClickLogout() {
    axios
      .post('/api/logout')
      .then((response) => {
        setState.isLogin(false);
        setState.params(null);
        props.history.push('/login');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <>
      <Subtitle subtitle="Logout" />
      <button className="btn btn-outline-danger" onClick={onClickLogout}>
        Log out
      </button>
    </>
  );
}
