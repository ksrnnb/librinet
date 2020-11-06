import Header from '../components/Header';
import React, { createContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { MyRouter } from '../components/MyRouter';
import { Response, Params } from '../types/Interfaces';

import { BrowserRouter as Router } from 'react-router-dom';

const defaultData: any = { hasLoaded: false, params: {} };
const axios: any = window.axios;

export const DataContext: any = createContext(defaultData);
export const SetStateContext: any = createContext({
  params: function () {
    return;
  },
});

function App() {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [params, setParams]: [params: Params | null, setParams: any] = useState(
    null
  );

  useEffect(setUp, []);

  function setUp() {
    axios
      .get('/api/user/auth')
      .then((response: Response) => {
        // response.data
        // {params: {user, following_posts, examples} }
        const data: Params = response.data;
        setParams(data);
        setHasLoaded(true);
      })
      .catch(() => {
        alert('ユーザー情報取得時にエラーが発生しました');
      });
  }

  const data = {
    hasLoaded: hasLoaded,
    params: params,
  };

  const setState = {
    params: setParams,
  };

  if (hasLoaded) {
    return (
      <DataContext.Provider value={data}>
        <SetStateContext.Provider value={setState}>
          <Router>
            <Header />
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
