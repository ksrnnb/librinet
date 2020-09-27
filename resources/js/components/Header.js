import React from 'react';
import ReactDOM from 'react-dom';

const axios = require('axios');

export default Header;
function Header(props) {

    let hamburger = null;
    if (props.hasHamburger) {
        hamburger = 
        <>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                <li className="nav-item active">
                    <a className="nav-link" href="/home">ホーム</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/book">本を検索する</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/user/search">ユーザーを検索する</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href={props.userUrl}>プロフィール</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/logout">ログアウト</a>
                </li>
                </ul>
            </div>
        </>;
    }

    return (
        <header>
            <nav className="navbar fixed-top bg-success">
                <a className="navbar-brand" href="/home">{props.app}</a>
                {hamburger}
            </nav>
        </header>
    );
}
