import Header from '../components/Header';
import React, { createContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { MyRouter } from '../components/MyRouter';
import { Data, Response, Params } from '../types/Interfaces';

import { BrowserRouter as Router } from 'react-router-dom';

const axios: any = window.axios;

export const DataContext = createContext({} as Data);
export const SetParamsContext: any = createContext(() => {
  return;
});

const App: React.FC = () => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [params, setParams] = useState<Params>({} as Params);

  useEffect(setUp, []);

  function setUp(): void {
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

  if (hasLoaded) {
    return (
      <DataContext.Provider value={data}>
        <SetParamsContext.Provider value={setParams}>
          <Router>
            <Header />
            <MyRouter />
          </Router>
        </SetParamsContext.Provider>
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
};

if (document.getElementById('app')) {
  ReactDOM.render(<App />, document.getElementById('app'));
}
