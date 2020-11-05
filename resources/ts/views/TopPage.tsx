import React, { useContext, useEffect, useState } from 'react';
import { PropsContext } from '../components/MyRouter';
import { MyLink } from '../functions/MyLink';
import { DataContext, SetStateContext } from './App';
import { guestLogin } from './Login';

function Content(props: any) {
  const main_props: any = useContext(PropsContext);
  const afterLogin: any = props.afterLogin;
  return (
    <div id="top-content" className="top-content">
      <div className="container top-wrapper">
        <p className="title">リブリーネット</p>
        <p className="title-message">あなたの読んだ本をシェアしましょう！</p>

        <button
          className="btn btn-success d-block"
          onClick={() => guestLogin(afterLogin)}
        >
          ゲストユーザーでログイン
        </button>

        <button
          className="btn btn-outline-info d-block"
          onClick={() => MyLink.signup(main_props)}
        >
          ユーザー登録
        </button>
        <div className="pb-5">
          <button
            className="btn btn-outline-info d-block"
            onClick={() => MyLink.login(main_props)}
          >
            通常のユーザーでログイン
          </button>
        </div>
      </div>
    </div>
  );
}

function MyCarousel(props: any) {
  const { active, height, afterLogin } = props;
  const attr = height > 0 ? { style: { minHeight: height } } : {};
  return (
    <div className="carousel slide carousel-fade" data-ride="carousel">
      <div className="carousel-inner">
        <div className="carousel-item active">
          <div className="top-1" {...attr}></div>
        </div>
        <div className={`carousel-item ${active}`}>
          <div className="top-2" {...attr}></div>
        </div>
        <div className={`carousel-item ${active}`}>
          <div className="top-3" {...attr}></div>
        </div>
      </div>
      <Content afterLogin={afterLogin} />
    </div>
  );
}

export default function TopPage() {
  const props: any = useContext(PropsContext);
  const setState: any = useContext(SetStateContext);
  const data: any = useContext(DataContext);
  const [height, setHeight]: any = useState(0);
  const [active, setActive]: any = useState('active');

  function afterLogin(user: any) {
    setState.params(user);
    MyLink.home(props);
  }

  useEffect(() => {
    // ログイン済みの場合は/homeへ
    data.params.user && MyLink.home(props);

    // carouselが自動で動かないので、自分で動かす。7秒ごと。
    window.$('.carousel').carousel({
      interval: 7000,
      pause: false,
    });
    // top-contentはabsoluteを指定しており、親要素に高さが反映されないので、ここで取得して反映。
    setHeight(window.$('#top-content').height());

    // window幅が変わった時も高さを調整。
    // .resize()は非推奨らしい
    window.$(window).on('resize', () => {
      const isTopPage = props.history.location.pathname === '/';

      // top pageの場合はstateの更新、そうでない場合は、更新せずにresizeイベントを削除
      if (isTopPage) {
        const height = window.$('#top-content').height();
        setHeight(height);
      } else {
        window.$(window).off('resize');
      }
    });

    // はじめは2枚目以降もactiveにしておくことで、画像を読み込ませとく。
    setActive('');
  }, []);

  return (
    <div className="carousel-wrapper">
      <MyCarousel active={active} height={height} afterLogin={afterLogin} />
    </div>
  );
}
