import React, { useContext, useState } from 'react';
import { SetParamsContext } from './App';
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
import { User, Response } from '../types/Interfaces';

const axios = window.axios;

export function guestLogin(afterLogin: any) {
  axios
    .get('/sanctum/csrf-cookie')
    .then(() => {
      axios
        .post('/api/guest/login')
        .then((response: Response) => {
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
  const [strId, setStrId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<string[]>([]);
  const props = useContext(PropsContext);
  const setParams: any = useContext(SetParamsContext);

  function afterLogin(user: User) {
    setParams(user);
    MyLink.home(props);
  }

  function pressEnter(e: any) {
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
          .then((response: Response) => {
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
      <NoImageCard>
        <Caption
          isTop={true}
          content="ユーザー情報の入力（通常のユーザーでログイン）"
        />
        <Errors errors={errors} />
        <form>
          <TextInput
            name="user-id"
            content="ユーザーID"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setStrId(e.target.value)
            }
            onKeyDown={pressEnter}
          />
          <TextInput
            type="password"
            name="password"
            content="パスワード"
            autoComplete="off"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            onKeyDown={pressEnter}
          />
          <MyButton
            id="normal-login"
            onClick={normalUserLogin}
            content="通常のユーザーでログイン"
          />
        </form>
      </NoImageCard>

      <NoImageCard bgColor="light-orange" margin="my-5">
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
    </>
  );
}
