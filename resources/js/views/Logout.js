import React, { useContext } from 'react';
import { DataContext, SetStateContext } from './App';
import { NoImageCard } from '../components/Components';
import { PropsContext } from '../components/MyRouter';
import Subtitle from '../components/Subtitle';
import { MyLink } from '../functions/MyLink';

const axios = window.axios;

export default function logout() {
  const props = useContext(PropsContext);
  const setState = useContext(SetStateContext);
  const data = useContext(DataContext);

  function linkToTop() {
    const params = {
      user: undefined,
      following_posts: [],
      examples: data.params.examples,
    };

    setState.params(params);
    MyLink.top(props);
  }

  function onClickLogout() {
    axios
      .post('/api/logout')
      .then(() => {
        linkToTop();
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
