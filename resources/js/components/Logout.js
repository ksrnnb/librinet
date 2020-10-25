import React, { useContext } from 'react';
import { DataContext, SetStateContext } from './App';
import { NoImageCard, Caption } from './Components';
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
      <Subtitle subtitle="ログアウト" />
      <NoImageCard>
        <p>ログアウトしますか？</p>
        <button className="btn btn-outline-danger" onClick={onClickLogout}>
          ログアウト
        </button>
      </NoImageCard>

    </>
  );
}
