import React, { useContext, useEffect, useState } from 'react';
import { PropsContext } from '../components/MyRouter';
import { MyLink } from '../functions/MyLink';
import { DataContext, SetStateContext } from './App';
import { guestLogin } from './Login';
import { PropTypes } from 'prop-types';

function Content(props) {
  const main_props = useContext(PropsContext);
  const afterLogin = props.afterLogin;
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

Content.propTypes = {
  afterLogin: PropTypes.func,
};

function MyCarousel(props) {
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

MyCarousel.propTypes = {
  active: PropTypes.string,
  height: PropTypes.number,
  afterLogin: PropTypes.func,
};

export default function TopPage() {
  const props = useContext(PropsContext);
  const setState = useContext(SetStateContext);
  const data = useContext(DataContext);
  const [height, setHeight] = useState(0);
  const [active, setActive] = useState('active');

  function afterLogin(user) {
    setState.params(user);
    MyLink.home(props);
  }

  useEffect(() => {
    // ログイン済みの場合は/homeへ
    data.params.user && MyLink.home(props);

    // carouselが自動で動かないので、自分で動かす。7秒ごと。
    $('.carousel').carousel({
      interval: 7000,
      pause: false,
    });
    // top-contentはabsoluteを指定しており、親要素に高さが反映されないので、ここで取得して反映。
    setHeight($('#top-content').height());

    // window幅が変わった時も高さを調整。
    // .resize()は非推奨らしい
    $(window).on('resize', () => {
      const height = $('#top-content').height();
      setHeight(height);
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
