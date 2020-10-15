import React from 'react';
import { Link } from 'react-router-dom';
import { PropTypes } from 'prop-types';

function closeNav() {
  const button = document.getElementsByClassName('navbar-toggler')[0];
  const navbarDiv = document.getElementById('navbarSupportedContent');

  button.classList.add('collapsed');
  button.setAttribute('aria-expanded', 'false');
  navbarDiv.classList.remove('show');
}

export default function Header(props) {
  let profileAndLogoutLink = null;
  if (props.userUrl) {
    profileAndLogoutLink = (
      <>
        <li className="nav-item">
          <Link className="nav-link" to={props.userUrl} onClick={closeNav}>
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

  const hamburger = (
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
            <Link className="nav-link" to="/user/search" onClick={closeNav}>
              ユーザーを検索する
            </Link>
          </li>
          {profileAndLogoutLink}
        </ul>
      </div>
    </>
  );

  return (
    <header>
      <nav className="navbar fixed-top bg-success">
        <a className="navbar-brand" href="/home">
          {document.title}
        </a>
        {hamburger}
      </nav>
    </header>
  );
}

Header.propTypes = {
  userUrl: PropTypes.string,
};
