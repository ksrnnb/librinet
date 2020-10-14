import React from 'react';
import { Link } from 'react-router-dom';

export default function SubColumn(props) {
  const userUrl = props.userUrl;
  let profileAndLoginLogoutLink = null;
  if (userUrl) {
    profileAndLoginLogoutLink = (
      <>
        <Link to={userUrl}>
          <h4 className="mt-4">プロフィール</h4>
        </Link>
        <Link to="/logout">
          <h4 className="mt-4">ログアウト</h4>
        </Link>
      </>
    );
  } else {
    profileAndLoginLogoutLink = (
      <>
        <Link to="signup">
          <h4 className="mt-4">ユーザー登録</h4>
        </Link>
        <Link to="login">
          <h4 className="mt-4">ログイン</h4>
        </Link>
      </>
    );
  }

  return (
    <div id="sub-column" className="border-right">
      <Link to="/home">
        <h4>ホーム</h4>
      </Link>

      <Link to="/book">
        <h4 className="mt-4">本を検索する</h4>
      </Link>

      <Link to="/user">
        <h4 className="mt-4">ユーザーを検索する</h4>
      </Link>
      {profileAndLoginLogoutLink}
    </div>
  );
}
