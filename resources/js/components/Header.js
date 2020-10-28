import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import { DataContext } from '../views/App';

function closeNav() {
  const button = document.getElementsByClassName('navbar-toggler')[0];
  const navbarDiv = document.getElementById('navbarSupportedContent');

  button.classList.add('collapsed');
  button.setAttribute('aria-expanded', 'false');
  navbarDiv.classList.remove('show');
}

LinkGroup.propTypes = {
  user: PropTypes.object,
};

function LinkGroup(props) {
  const user = props.user;
  if (typeof user === 'undefined') {
    return (
      <>
        <li className="nav-item">
          <Link className="nav-link" to="/home" onClick={closeNav}>
            ホーム
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link" to="/book" onClick={closeNav}>
            本を検索する
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link" to="/user" onClick={closeNav}>
            ユーザーを検索する
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link" to="signup" onClick={closeNav}>
            ユーザー登録
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link" to="login" onClick={closeNav}>
            ログイン
          </Link>
        </li>
      </>
    );
  }

  return (
    <>
      <li className="nav-item">
        <Link className="nav-link" to="/home" onClick={closeNav}>
          ホーム
        </Link>
      </li>

      <li className="nav-item">
        <Link className="nav-link" to="/book" onClick={closeNav}>
          本を検索する
        </Link>
      </li>

      <li className="nav-item">
        <Link className="nav-link" to="/user" onClick={closeNav}>
          ユーザーを検索する
        </Link>
      </li>

      <li className="nav-item">
        <Link className="nav-link" to="/notification" onClick={closeNav}>
          通知
        </Link>
      </li>

      <li className="nav-item">
        <Link
          className="nav-link"
          to={'/user/profile/' + user.str_id}
          onClick={closeNav}
        >
          プロフィール
        </Link>
      </li>

      <li className="nav-item">
        <Link className="nav-link" to="/logout" onClick={closeNav}>
          ログアウト
        </Link>
      </li>
    </>
  );
}

function Hamburger() {
  const data = useContext(DataContext);

  return (
    <>
      <button
        id="humburger"
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          {data && <LinkGroup user={data.params.user} />}
        </ul>
      </div>
    </>
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
