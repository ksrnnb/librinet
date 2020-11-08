import React, { useContext, useEffect } from 'react';
import { DataContext, SetParamsContext } from './App';
import Subtitle from '../components/Subtitle';
import PropTypes from 'prop-types';
import { PropsContext } from '../components/MyRouter';
import { MyCard } from '../components/MyCard';
import { MyLink } from '../functions/MyLink';
import { getDeltaTimeMessage } from '../functions/TimeFunctions';
const axios = window.axios;

/**
 * @param {object} notification
 * @return {string}
 */
function getMessageAndImage(notification: any) {
  const info: any = new Object();

  // 投稿などが削除済みの場合はエラーになるので、何も返さない。
  // TODO: Notificationもデータベースから消す必要がある。
  try {
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
  } catch (error) {
    return null;
  }

  info.image = info.user.image || '/img/icon.svg';
  return info;
}

/**
 * notificationモデルを1個受け取って、通知のCardを返す。
 * @param {object} props
 * @return {JSX}
 */
function Notice(props: any) {
  const main_props = useContext(PropsContext);
  const notification = props.notification;

  const timeMessage = getDeltaTimeMessage(notification.created_at);
  const info = getMessageAndImage(notification);

  function onClickCard() {
    // comment or postへのリンク
    if (info.path.includes('api')) {
      axios
        .get(info.path)
        .then((response: any) => {
          const post = response.data;
          MyLink.comment(main_props, post);
        })
        .catch(() => {
          // 投稿がみつからない場合（既に削除済みなど）
          alert('投稿がみつかりません。既に削除された可能性があります');
        });

      // ユーザーへのリンクの場合はそのまま移動する。
    } else {
      MyLink.userProfile(main_props, info.user.str_id);
    }
  }

  // 通知内容の項目が既に削除されていた場合はnull
  if (info) {
    return (
      <MyCard
        image={
          <img className="img-fluid w-100" src={info.image} alt="user-image" />
        }
        body={
          <>
            <p>{info.message}</p>
            <p>
              <small className="text-muted">{timeMessage}</small>
            </p>
          </>
        }
        addingClass="notification-card mb-3"
        onClick={onClickCard}
      />
    );
  } else {
    return <></>;
  }
}

export default function Notification() {
  const data: any = useContext(DataContext);
  const props: any = useContext(PropsContext);
  const setParams: any = useContext(SetParamsContext);

  const isNotLogin = typeof data.params.user === 'undefined';

  if (isNotLogin) {
    MyLink.home(props);
    return <></>;
  }

  const notifications = data.params.user.notifications || [];

  useEffect(() => {
    const ids: Array<number> = [];
    notifications.forEach((notice: any) => {
      if (notice.is_read == false) {
        ids.push(notice.id);
      }
    });

    if (ids.length) {
      makeNotificationIsRead(ids);
    }
  }, []);

  function makeNotificationIsRead(ids: Array<number>) {
    axios
      .post('/api/notification', { ids: ids })
      .then(() => {
        notifications.forEach((notice: any) => {
          notice.is_read = true;
        });

        const params = Object.assign({}, data.params);
        params.user.notifications = notifications;

        setParams(params);
      })
      .catch(() => {
        alert('予期しないエラーが発生しました');
      });
  }

  // 通知を日付の新しい順にソート
  notifications.sort((a: any, b: any) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <>
      <Subtitle subtitle="通知" />
      {notifications.map((notification: any) => (
        <Notice notification={notification} key={notification.id} />
      ))}
    </>
  );
}

Notice.propTypes = {
  notification: PropTypes.object,
};
