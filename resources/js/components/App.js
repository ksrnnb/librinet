import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header';
import Book from './Book';
import Home from './Home';
import User from './User';
import Profile from './Profile';
import Login from './Login';
import Logout from './Logout';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

const axios = window.axios;

function SubColumn(props) {
  const params = props.params;
  const userUrl = props.userUrl;
  let profileAndLoginLogoutLink = null;
  if (userUrl) {
    profileAndLoginLogoutLink = (
      <>
        <Link
          to={{
            pathname: userUrl,
            state: { params: params, viewerStrId: params.user.str_id },
          }}
        >
          <h4 className="mt-4">プロフィール</h4>
        </Link>
        <Link to="/logout">
          <h4 className="mt-4">ログアウト</h4>
        </Link>
      </>
    );
  } else {
    profileAndLoginLogoutLink = (
      <Link to="login">
        <h4 className="mt-4">ログイン</h4>
      </Link>
    );
  }

  return (
    <div className="sub-column border-right">
      <Link to="/home">
        <h4>ホーム</h4>
      </Link>

      <Link to="/book">
        <h4 className="mt-4">本を検索する</h4>
      </Link>

      <Link to="/user/search">
        <h4 className="mt-4">ユーザーを検索する</h4>
      </Link>
      {profileAndLoginLogoutLink}
    </div>
  );
}

class App extends React.Component {
  constructor() {
    super();

    // windowサイズが800px以上であればカラムを表示
    this.maxWidth = 800;
    const isVisible = window.innerWidth > this.maxWidth ? true : false;

    // TODO：非同期だからUndefined そもそも必要？
    const params = this.getParamsOfAuthenticatedUser();
    const isLogin = params !== null;

    this.state = {
      isVisible: isVisible,
      isLogin: isLogin,
      params: params,
    };
  }

  componentDidMount() {
    this.windowSizeChange.call(this);
  }

  getParamsOfAuthenticatedUser() {
    axios
      .get('/api/user/auth')
      .then((response) => {
        // TODO: Loginしていないときは？
        // response.data
        // {id: 5, name: ゲスト, ....}
        this.setState({
          isLogin: true,
          params: response.data,
        });
      })
      .catch((error) => {
        alert('error happened getting auth user');
      });
  }

  windowSizeChange() {
    window.addEventListener('resize', () => {
      let isVisible = this.state.isVisible;
      const changedLargeToSmall =
        isVisible && window.innerWidth < this.maxWidth;
      const changedSmallToLarge =
        !isVisible && window.innerWidth > this.maxWidth;

      if (changedLargeToSmall || changedSmallToLarge) {
        this.setState({
          isVisible: !isVisible,
        });
      }
    });
  }

  render() {
    const appName = document.title;

    let user = null;
    if (this.state.params) {
      user = this.state.params.user;
    }

    const params = this.state.params;

    let url;
    if (user) {
      url = '/user/profile/' + user.str_id;
    } else {
      url = null;
    }

    if (this.state.isVisible) {
      return (
        <Router>
          <div className="container">
            <Header userUrl={url} app={appName} hasHamburger={false} />
            <SubColumn userUrl={url} params={params} />
            <div className="container ml-300">
              <Switch>
                <Route path="/home" component={Home} />
                <Route path="/book" component={Book} />
                <Route path="/user/search" component={User} />
                <Route path="/user/profile/:strId" component={Profile} />
                <Route path="/login" component={Login} />
                <Route path="/logout" component={Logout} />
              </Switch>
            </div>
          </div>
        </Router>
      );
    } else {
      return (
        <Router>
          <div className="container">
            <Header userUrl={url} app={appName} hasHamburger={true} />
            <div className="container">
              <Switch>
                <Route path="/home" component={Home} />
                <Route path="/book" component={Book} />
                <Route path="/user/search" component={User} />
                <Route path="/user/profile/:strId" component={Profile} />
                <Route path="/login" component={Login} />
                <Route path="/logout" component={Logout} />
              </Switch>
            </div>
          </div>
        </Router>
      );
    }
  }
}

if (document.getElementById('app')) {
  ReactDOM.render(<App />, document.getElementById('app'));
}
