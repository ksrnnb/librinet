import React, { useContext, useState } from 'react';
import { DataContext, SetStateContext } from './App';
import { NoImageCard } from '../components/Components';
import { PropsContext } from '../components/MyRouter';
import Subtitle from '../components/Subtitle';
import { MyLink } from '../functions/MyLink';
import Errors from '../components/Errors';

const axios = window.axios;

export default function logout() {
  const props = useContext(PropsContext);
  const setState = useContext(SetStateContext);
  const data = useContext(DataContext);
  const [errors, setErrors] = useState([]);

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
      .catch(() => {
        setErrors(['ログアウト動作でエラーが発生しました']);
      });
  }

  return (
    <>
      <Subtitle subtitle="ログアウト" />
      <NoImageCard>
        <p>ログアウトしますか？</p>
        <Errors errors={errors} />
        <button className="btn btn-outline-danger" onClick={onClickLogout}>
          ログアウト
        </button>
      </NoImageCard>
    </>
  );
}
