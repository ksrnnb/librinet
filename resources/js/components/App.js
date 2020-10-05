import AddBook from './AddBook';
import Book from './Book';
import Comment from './Comment';
import Header from './Header';
import Home from './Home';
import Login from './Login';
import Logout from './Logout';
import Profile from './Profile';
import PostData from './Post';
import React from 'react';
import ReactDOM from 'react-dom';
import User from './User';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { isBoolean } from 'lodash';
import { post } from 'jquery';

const axios = window.axios;

function SubColumn(props) {
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

      <Link to="/user">
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
    this.onClickDelete = this.onClickDelete.bind(this);
  }

  login(props) {
    // TODO: 前にログインしていた場合、反映に少し時間がかかる。
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
        if (typeof response.data == 'object') {
          this.setState({
            isLogin: true,
            params: response.data,
          });
        }
      })
      .catch((error) => {
        console.log(error);
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

  onClickDelete(e) {
    const uuid = e.target.dataset.uuid;
    // 文字列の'false'はtrueになってしまうので以下のように判定
    const isPost = e.target.dataset.ispost === 'true' ? true : false;

    const path = isPost ? '/api/post' : '/api/comment';

    // TODO: 本当に消しますか？って出したい
    axios
      .delete(path, {
        data: { uuid: uuid },
      })
      .then((response) => {
        const posts = response.data;
        const params = this.state.params;
        params.posts = posts;

        this.setState({
          params: params,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  pages(params, isVisible) {
    const exampleUsers = params ? params.example_users : null;
    const genresBooks = params ? params.genres_books : null;
    const genres = params ? params.genres : null;
    const posts = params ? params.posts : null;
    const viewerId = params ? params.user.id : null;
    const viewerStrId = params ? params.user.str_id : null;

    let margin = null;
    if (isVisible) {
      margin = 'ml-300';
    }

    return (
      <div className={margin}>
        <Switch>
          <Route
            path="/home"
            render={() => (
              <Home
                posts={posts}
                viewerId={viewerId}
                onClickDelete={this.onClickDelete}
              />
            )}
          />
          <Route
            exact
            path="/book"
            render={(props) => <Book props={props} />}
          />
          <Route
            exact
            path="/user"
            render={() => <User example={exampleUsers} />}
          />
          <Route
            path="/user/profile/:strId"
            render={(props) => (
              <Profile
                props={props}
                params={params}
                viewerStrId={viewerStrId}
              />
            )}
          />
          <Route
            path="/login"
            render={(props) => <Login props={props} login={this.login} />}
          />
          <Route
            path="/logout"
            render={(props) => <Logout props={props} logout={this.logout} />}
          />
          <Route
            path="/book/post/:isbn"
            render={(props) => <PostData props={props} />}
          />
          <Route
            path="/book/add/:isbn"
            render={(props) => <AddBook props={props} />}
          />
          <Route
            path="/comment/:uuid"
            render={(props) => (
              <Comment
                genresBooks={genresBooks}
                genres={genres}
                viewerId={viewerId}
                props={props}
              />
            )}
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

    // const hasLoaded = params != null;

    // if (hasLoaded) {
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
    // } else {
    //   return <></>;
    // }
  }
}

if (document.getElementById('app')) {
  ReactDOM.render(<App />, document.getElementById('app'));
}
