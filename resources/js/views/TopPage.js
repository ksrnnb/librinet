import React, { useContext, useEffect } from 'react';
import { PropsContext } from '../components/MyRouter';
import { MyLink } from '../functions/MyLink';
import { DataContext, SetStateContext } from './App';
import { guestLogin } from './Login';

export default function TopPage() {
  const props = useContext(PropsContext);
  const setState = useContext(SetStateContext);
  const data = useContext(DataContext);

  function afterLogin(user) {
    setState.params(user);
    MyLink.home(props);
  }

  useEffect(() => {
    // ログイン済みの場合は/homeへ
    data.params.user && MyLink.home(props);
  }, []);

  return (
    <>
      <div className="top-1">
        <div className="top-content">
          <div className="container top-wrapper">
            <p className="title">リブリーネット</p>
            <p className="title-message">
              あなたの読んだ本をシェアしましょう！
            </p>

            <button
              className="btn btn-success d-block"
              onClick={() => guestLogin(afterLogin)}
            >
              ゲストユーザーでログイン
            </button>

            <button
              className="btn btn-outline-info d-block"
              onClick={() => MyLink.signup(props)}
            >
              ユーザー登録
            </button>
            <div className="pb-5">
              <button
                className="btn btn-outline-info d-block"
                onClick={() => MyLink.login(props)}
              >
                通常のユーザーでログイン
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
