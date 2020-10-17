import React, { useContext } from 'react';
import { DataContext } from './App';
import Subtitle from './Subtitle';
import PropTypes from 'prop-types';
import { PropsContext } from './Pages';
const axios = window.axios;

/**
 * @param {object} notification
 * @return {string}
 */
function getMessageAndImage(notification) {
  const info = new Object();

  if (notification.comment) {
    info.user = notification.comment.user;
    info.message = `${info.user.name}さんが、あなたの投稿にコメントしました`;
    info.path = '/api/comment/id/' + notification.comment.id;
  } else if (notification.follower) {
    info.user = notification.follower.follower_user;
    info.message = `${info.user.name}さんが、あなたをフォローしました`;
    info.path = '/user/profile/' + info.user.str_id;
  } else if (notification.like.post_id) {
    info.user = notification.like.user;
    info.message = `${info.user.name}さんが、あなたの投稿にいいねしました`;
    info.path = '/api/post/id/' + notification.like.post_id;
  } else if (notification.like.comment_id) {
    info.user = notification.like.user;
    info.message = `${info.user.name}さんが、あなたのコメントにいいねしました`;
    info.path = '/api/comment/id/' + notification.like.comment_id;
  }

  info.image = info.user.image || '/img/icon.svg';
  return info;
}

/**
 * @param {integer} deltaMiliSec
 * @return {string}
 */
function getDeltaTimeMessage(deltaMiliSec) {
  const deltaTimeSec = deltaMiliSec / 1000;
  let timeMessage;

  if (deltaTimeSec < 60) {
    timeMessage = `${deltaTimeSec}秒前`;
  } else if (deltaTimeSec < 60 * 60) {
    timeMessage = `${Math.floor(deltaTimeSec / 60)}分前`;
  } else if (deltaTimeSec < 60 * 60 * 24) {
    timeMessage = `${Math.floor(deltaTimeSec / 60 / 60)}時間前`;
  } else {
    timeMessage = `${Math.floor(deltaTimeSec / 60 / 60 / 24)}日前`;
  }

  return timeMessage;
}

/**
 * notificationモデルを1個受け取って、通知のCardを返す。
 * @param {object} props
 * @return {JSX}
 */
function Notice(props) {
  const pages_props = useContext(PropsContext);
  const notification = props.notification;
  const deltaTimeMiliSec = new Date() - new Date(notification.created_at);

  const timeMessage = getDeltaTimeMessage(deltaTimeMiliSec);
  const info = getMessageAndImage(notification);

  function onClickCard() {
    // comment or postへのリンク
    if (info.path.includes('api')) {
      axios
        .get(info.path)
        .then((response) => {
          const post = response.data;
          const path = '/comment/' + post.uuid;
          window.scroll(0, 0);

          pages_props.history.push({
            pathname: path,
            state: post,
          });
        })
        .catch(() => {
          // 投稿がみつからない場合（既に削除済みなど）
          alert('投稿がみつかりません。既に削除された可能性があります');
        });

      // ユーザーへのリンクの場合はそのまま移動する。
    } else {
      const path = '/user/profile/' + info.user.str_id;
      pages_props.history.push(path);
    }
  }

  // TODO: Comment -> Postへのリンク、いいね→投稿 or コメントへのリンク, フォロー-> userへのリンク
  return (
    <div className="card hover mb-3" onClick={() => onClickCard()}>
      <div className="row no-gutters">
        <div className="col-2">
          <img className="img-fluid" src={info.image} alt="user-image" />
        </div>
        <div className="col-10">
          <div className="card-body">
            <p className="card-text">{info.message}</p>
            <p className="card-text">
              <small className="text-muted">{timeMessage}</small>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Notification() {
  const data = useContext(DataContext);
  const notifications = data.params.user.notifications || [];

  // 日付の新しい順にソート
  notifications.sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at);
  });

  return (
    <>
      <Subtitle subtitle="通知" />
      {notifications.map((notification) => (
        <Notice notification={notification} key={notification.id} />
      ))}
    </>
  );
}

Notice.propTypes = {
  notification: PropTypes.object,
};
