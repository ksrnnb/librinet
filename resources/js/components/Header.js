import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import { DataContext } from '../views/App';

LinkGroup.propTypes = {
  user: PropTypes.object,
};

function LinkGroup(props) {
  const user = props.user;
  if (typeof user === 'undefined') {
    return (
      <>
        <Link className="dropdown-item" to="/home">
          ホーム
        </Link>

        <Link className="dropdown-item" to="/book">
          本を検索する
        </Link>

        <Link className="dropdown-item" to="/user">
          ユーザーを検索する
        </Link>

        <Link className="dropdown-item" to="signup">
          ユーザー登録
        </Link>

        <Link className="dropdown-item" to="login">
          ログイン
        </Link>
      </>
    );
  }

  return (
    <>
      <Link className="dropdown-item" to="/home">
        ホーム
      </Link>

      <Link className="dropdown-item" to="/book">
        本を検索する
      </Link>

      <Link className="dropdown-item" to="/user">
        ユーザーを検索する
      </Link>

      <Link className="dropdown-item" to="/notification">
        通知
      </Link>

      <Link className="dropdown-item" to={'/user/profile/' + user.str_id}>
        プロフィール
      </Link>

      <Link className="dropdown-item" to="/logout">
        ログアウト
      </Link>
    </>
  );
}

function Hamburger() {
  const data = useContext(DataContext);

  return (
    <div className="dropdown">
      <button
        id="hamburger"
        className="navbar-toggler"
        type="button"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div
        className="dropdown-menu dropdown-menu-right"
        aria-labelledby="dropdownMenuButton"
      >
        {data && <LinkGroup user={data.params.user} />}
      </div>
    </div>
  );
}

export default function Header() {
  return (
    <header>
      <nav className="navbar fixed-top bg-success">
        <span className="navbar-brand">
          <Link to="/">{document.title}</Link>
        </span>
        <Hamburger />
      </nav>
    </header>
  );
}

Header.propTypes = {
  userUrl: PropTypes.string,
};
