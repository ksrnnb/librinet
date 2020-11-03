import React, { useContext, useState } from 'react';
import { SetStateContext } from './App';
import {
  MyButton,
  Caption,
  TextInput,
  NoImageCard,
} from '../components/Components';
import { PropsContext } from '../components/MyRouter';
import Subtitle from '../components/Subtitle';
import { MyLink } from '../functions/MyLink';
import Errors from '../components/Errors';
const axios = window.axios;

export function guestLogin(afterLogin) {
  axios
    .get('/sanctum/csrf-cookie')
    .then(() => {
      axios
        .post('/api/guest/login')
        .then((response) => {
          const user = response.data;
          afterLogin(user);
        })
        .catch(() => {
          alert('ログインに失敗しました');
        });
    })
    .catch(() => {
      alert('ログイン動作時にエラーが発生しました');
    });
}

export default function Login() {
  const [strId, setStrId] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const props = useContext(PropsContext);
  const setState = useContext(SetStateContext);

  function afterLogin(user) {
    setState.params(user);
    MyLink.home(props);
  }

  function pressEnter(e) {
    if (e.keyCode === 13) {
      normalUserLogin();
    }
  }

  function normalUserLogin() {
    axios
      .get('/sanctum/csrf-cookie')
      .then(() => {
        axios
          .post('/api/login', {
            strId: strId,
            password: password,
          })
          .then((response) => {
            const user = response.data;
            afterLogin(user);
          })
          .catch(() => {
            setErrors(['ログインに失敗しました']);
          });
      })
      .catch(() => {
        alert('ログイン動作時にエラーが発生しました');
      });
  }

  return (
    <>
      <Subtitle subtitle="ログイン" />
      <NoImageCard bgColor="light-orange">
        <Caption isTop={true} content="ゲストユーザーでログイン" />
        <p>ゲストユーザーは、以下の機能を除く全ての機能がご利用になれます。</p>
        <ul>
          <li>ユーザー名、ユーザーIDの編集</li>
          <li>ユーザーの削除</li>
        </ul>
        <MyButton
          onClick={() => guestLogin(afterLogin)}
          content="ゲストユーザーでログイン"
        />
      </NoImageCard>

      <NoImageCard margin="my-5">
        <Caption
          isTop={true}
          content="ユーザー情報の入力（通常のユーザーでログイン）"
        />
        <Errors errors={errors} />
        <form>
          <TextInput
            name="user-id"
            content="ユーザーID"
            onChange={(e) => setStrId(e.target.value)}
            onKeyDown={pressEnter}
          />
          <TextInput
            type="password"
            name="password"
            content="パスワード"
            autoComplete="off"
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={pressEnter}
          />
          <MyButton
            id="normal-login"
            onClick={normalUserLogin}
            content="通常のユーザーでログイン"
          />
        </form>
      </NoImageCard>
    </>
  );
}
