import Header from './Header';
import React, { createContext } from 'react';
import ReactDOM from 'react-dom';
import Pages from './Pages';
import SubColumn from './SubColumn';

import { BrowserRouter as Router } from 'react-router-dom';

const axios = window.axios;
export const DataContext = createContext();
export const SetStateContext = createContext();

class App extends React.Component {
  constructor() {
    super();

    // const params = this.getParamsOfAuthenticatedUser();
    // const isLogin = params !== null;

    this.state = {
      isLogin: false,
      params: null,
      hasLoaded: false,
    };

    this.login = this.login.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.setStateBooks = this.setStateBooks.bind(this);
    this.setStateGenresBooks = this.setStateGenresBooks.bind(this);
    this.setStateUser = this.setStateUser.bind(this);
    this.setParams = this.setParams.bind(this);
    this.setIsLogin = this.setIsLogin.bind(this);
  }

  componentDidMount() {
    this.getParamsOfAuthenticatedUser();
  }

  setStateUser(user) {
    // ユーザー削除時は空のオブジェクト
    const isEmpty = Object.keys(user).length === 0;
    if (isEmpty) {
      this.setState({
        isLogin: false,
        params: null,
      });
    } else {
      const params = this.state.params;
      params.user = user;

      this.setState({
        params: params,
      });
    }
  }

  setParams(params) {
    this.setState({
      params: params,
    });
  }

  setIsLogin(isLogin) {
    this.setState({
      isLogin: isLogin,
    });
  }

  setStatePosts(posts) {
    const params = this.state.params;
    params.posts = posts;
    this.setState({
      params: params,
    });
  }

  setStateBooks(books) {
    const params = this.state.params;
    params.books = books;
    this.setState({
      params: params,
    });
  }

  setStateGenresBooks(genres_books) {
    const params = this.state.params;
    params.genres_books = genres_books;

    this.setState({
      params: params,
    });
  }

  login(props) {
    // TODO: 前にログインしていた場合、反映に少し時間がかかる。
    this.getParamsOfAuthenticatedUser();
    props.history.push('/home');
  }

  getParamsOfAuthenticatedUser() {
    axios
      .get('/api/user/auth')
      .then((response) => {
        // TODO: Loginしていないときは？
        // response.data
        // {books, examples, followers, follows, genres, genres_books,  posts, user}
        if (typeof response.data == 'object') {
          this.setState({
            isLogin: true,
            params: response.data,
            hasLoaded: true,
          });
        } else {
          this.setState({
            hasLoaded: true,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        alert('error happened getting auth user');
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

  render() {
    const appName = document.title;
    const params = this.state.params;
    const hasLoaded = this.state.hasLoaded;
    const setState = {
      params: this.setParams,
      isLogin: this.setIsLogin,
    };

    console.log('--state---');
    console.log(this.state);

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
    if (hasLoaded) {
      return (
        <DataContext.Provider value={this.state}>
          <SetStateContext.Provider value={setState}>
            <Router>
              <div className="container">
                <Header userUrl={url} app={appName} />
                <SubColumn userUrl={url} params={params} logout={this.logout} />
                <Pages
                  params={params}
                  login={this.login}
                  onClickDelete={this.onClickDelete}
                  setStateBooks={this.setStateBooks}
                  setStateGenresBooks={this.setStateGenresBooks}
                  setStateUser={this.setStateUser}
                  redirectUserProfileAfterDeleteBooks={
                    this.redirectUserProfileAfterDeleteBooks
                  }
                />
              </div>
            </Router>
          </SetStateContext.Provider>
        </DataContext.Provider>
      );
    } else {
      // 読み込み中の処理
      return (
        <Router>
          <div className="container">
            <Header userUrl={url} app={appName} />
            <div className="text-center mt-5">
              <div className="spinner-border text-success" role="status">
                <span className="sr-only">Loading...</span>
              </div>
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
