import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { DataContext } from '../views/App';

export default function SubColumn() {
  const data = useContext(DataContext);
  const user = data.params.user;

  let notReadCount = 0;
  if (user) {
    notReadCount = user.notifications.reduce((accumlator, notification) => {
      if (notification.is_read == false) {
        return accumlator + 1;
      }

      return accumlator;
    }, 0);
  }

  if (typeof user === 'undefined') {
    return (
      <div id="sub-column">
        <Link to="/home">
          <h4>ホーム</h4>
        </Link>

        <Link to="/book">
          <h4 className="mt-4">本を検索する</h4>
        </Link>

        <Link to="/user">
          <h4 className="mt-4">ユーザーを検索する</h4>
        </Link>

        <Link to="signup">
          <h4 className="mt-4">ユーザー登録</h4>
        </Link>
        <Link to="login">
          <h4 className="mt-4">ログイン</h4>
        </Link>
      </div>
    );
  }

  return (
    <div id="sub-column">
      <Link to="/home">
        <h4>ホーム</h4>
      </Link>

      <Link to="/book">
        <h4 className="mt-4">本を検索する</h4>
      </Link>

      <Link to="/user">
        <h4 className="mt-4">ユーザーを検索する</h4>
      </Link>

      <Link to="/notification">
        <h4 className="mt-4 notification-budge" data-count={notReadCount}>
          通知
        </h4>
      </Link>

      <Link to={'/user/profile/' + user.str_id}>
        <h4 className="mt-4">プロフィール</h4>
      </Link>

      <Link to="/logout">
        <h4 className="mt-4">ログアウト</h4>
      </Link>
    </div>
  );
}
