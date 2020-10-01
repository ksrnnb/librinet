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
    // const params = this.getParamsOfAuthenticatedUser();
    // const isLogin = params !== null;

    this.state = {
      isVisible: isVisible,
      isLogin: false,
      params: null,
    };

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.pages = this.pages.bind(this);
  }

  login(props) {
    this.getParamsOfAuthenticatedUser();
    props.history.push('/home');
  }

  logout(props) {
    axios
      .post('/api/logout')
      .then((response) => {
        this.setState({
          isLogin: false,
        });
        props.history.push('/login');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  componentDidMount() {
    this.windowSizeChange.call(this);
    this.getParamsOfAuthenticatedUser();
  }

  getParamsOfAuthenticatedUser() {
    axios
      .get('/api/user/auth')
      .then((response) => {
        // TODO: Loginしていないときは？
        // response.data
        // {books, example_users, followers, follows, genres, genres_books,  posts, user}
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

  pages(params, isVisible) {
    const exampleUsers = params ? params.example_users : null;
    const posts = params ? params.posts : null;
    const viewerId = params ? params.user.id : null;

    let margin = null;
    if (isVisible) {
      margin = 'ml-300';
    }

    return (
      <div className={margin}>
        <Switch>
          <Route
            path="/home"
            render={() => <Home posts={posts} viewerId={viewerId} />}
          />
          <Route path="/book" component={Book} />
          <Route
            path="/user/search"
            render={() => <User example={exampleUsers} />}
          />
          <Route path="/user/profile/:strId" component={Profile} />
          <Route
            path="/login"
            render={(props) => <Login props={props} login={this.login} />}
          />
          {/* <Route path="/logout" component={Logout} /> */}
          <Route
            path="/logout"
            render={(props) => <Logout props={props} logout={this.logout} />}
          />
        </Switch>
      </div>
    );
  }

  render() {
    const appName = document.title;
    const params = this.state.params;
    const isVisible = this.state.isVisible;

    // TODO: まとめられない？
    let user = null;
    if (params) {
      user = this.state.params.user;
    }

    let url;
    if (this.state.isLogin) {
      url = '/user/profile/' + user.str_id;
    } else {
      url = null;
    }

    if (isVisible) {
      return (
        <Router>
          <div className="container">
            <Header userUrl={url} app={appName} hasHamburger={false} />
            <SubColumn userUrl={url} params={params} logout={this.logout} />
            {this.pages(params, isVisible)}
          </div>
        </Router>
      );
    } else {
      return (
        <Router>
          <div className="container">
            <Header userUrl={url} app={appName} hasHamburger={true} />
            {this.pages(params, isVisible)}
          </div>
        </Router>
      );
    }
  }
}

if (document.getElementById('app')) {
  ReactDOM.render(<App />, document.getElementById('app'));
}
