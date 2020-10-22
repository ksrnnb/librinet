import React, { useContext } from 'react';
import { DataContext, SetStateContext } from './App';
import { PropsContext } from './Pages';
import Subtitle from './Subtitle';

const axios = window.axios;

export default function logout() {
  const props = useContext(PropsContext);
  const setState = useContext(SetStateContext);
  const data = useContext(DataContext);

  function linkToLogin() {
    const params = {
      user: null,
      following_posts: [],
      examples: data.params.examples,
    };

    setState.params(params);
    setState.isLogin(false);

    props.history.push('/login');
  }

  function onClickLogout() {
    axios
      .post('/api/logout')
      .then(() => {
        linkToLogin();
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
