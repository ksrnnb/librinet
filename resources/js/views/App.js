import Header from '../components/Header';
import React, { createContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { MyRouter } from '../components/MyRouter';

import { BrowserRouter as Router } from 'react-router-dom';

const axios = window.axios;
export const DataContext = createContext();
export const SetStateContext = createContext();

function App() {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [params, setParams] = useState(null);

  useEffect(setUp, []);

  function setUp() {
    axios
      .get('/api/user/auth')
      .then((response) => {
        // TODO: Loginしていないときは？
        // response.data
        // {params: {user, following_posts, examples} }
        const data = response.data;
        // console.log(data);
        setParams(data);
        setHasLoaded(true);
        data.user && setIsLogin(true);
      })
      .catch((error) => {
        console.log(error);
        alert('error happened getting auth user');
      });
  }

  const data = {
    hasLoaded: hasLoaded,
    isLogin: isLogin,
    params: params,
  };
  const setState = {
    params: setParams,
    isLogin: setIsLogin,
  };

  let user = null;
  let url = null;

  if (params && params.user) {
    user = params.user;
    url = '/user/profile/' + user.str_id;
  }

  if (hasLoaded) {
    return (
      <DataContext.Provider value={data}>
        <SetStateContext.Provider value={setState}>
          <Router>
            <Header userUrl={url} />
            <MyRouter />
          </Router>
        </SetStateContext.Provider>
      </DataContext.Provider>
    );
  } else {
    // 読み込み中の処理
    return (
      <Router>
        <Header />
        <div id="spinner-wrapper" className="text-center">
          <div className="spinner-border text-success" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </Router>
    );
  }
}

if (document.getElementById('app')) {
  ReactDOM.render(<App />, document.getElementById('app'));
}
