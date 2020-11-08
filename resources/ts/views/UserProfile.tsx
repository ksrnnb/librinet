import React, { useState, useContext, useEffect } from 'react';
import Subtitle from '../components/Subtitle';
import UserCard from '../components/UserCard';
import Bookshelf from '../components/Bookshelf';
import { DataContext, SetParamsContext } from './App';
import { PropsContext } from '../components/MyRouter';
import { MyLink } from '../functions/MyLink';

const axios = window.axios;

function EditUserButton(props: any) {
  const user: any = props.user;
  const viewerStrId: any = props.viewerStrId;
  const main_props: any = useContext(PropsContext);

  // 表示しているユーザーと、閲覧者が異なる場合は編集ボタン非表示
  if (user.str_id !== viewerStrId) {
    return <></>;
  }
  // 表示しているユーザーが、閲覧者自身の場合
  return (
    <div>
      <button
        type="button"
        className="btn btn-outline-success d-block"
        onClick={() => MyLink.editUser(main_props, user.str_id)}
      >
        ユーザー情報を編集する
      </button>
    </div>
  );
}

function FollowButton(props: any) {
  const user: any = props.user;
  const viewerUser: any = props.viewerUser;

  if (user.id == viewerUser.id) {
    return <></>;
  }

  let className, content;

  if (props.isFollowing) {
    className = 'btn btn-success d-block';
    content = 'フォロー中';
  } else {
    className = 'btn btn-outline-success d-block';
    content = 'フォローする';
  }

  const FollowButton = (
    <button className={className} onClick={props.handleFollow}>
      {content}
    </button>
  );

  return FollowButton;
}
function FollowNumber(props: any) {
  const follows: number = props.follows.length;
  const followers: number = props.followers.length;
  return (
    <>
      <p
        className="hover-link my-3"
        id="follow"
        data-link="/follows"
        data-count={follows}
        onClick={props.onClick}
      >
        フォロー：{follows}
      </p>
      <p
        className="hover-link ml-4 my-3"
        id="follower"
        data-link="/followers"
        data-count={followers}
        onClick={props.onClick}
      >
        フォロワー：{followers}
      </p>
    </>
  );
}

function EditBookshelfButton(props: any) {
  const hasLoaded: boolean = 'books' in props;
  const main_props: any = useContext(PropsContext);

  // showing userの読み込みと、そもそもviewerUserが代入されている（ログインしている）の確認
  if (hasLoaded && props.viewerUser) {
    const canEdit = props.user.id == props.viewerUser.id;
    const strId = props.user.str_id;

    const books = props.books;
    // 本棚に追加したあとは、配列ではなくてObjectだったので、対応。
    const isNotEmpty = Array.isArray(books)
      ? books.length
      : Object.keys(books).length;

    if (canEdit && isNotEmpty) {
      return (
        <>
          <button
            className="dropdown-item"
            type="button"
            onClick={() => MyLink.editGenre(main_props, strId)}
          >
            ジャンルを編集する
          </button>
          <button
            className="dropdown-item"
            type="button"
            onClick={() => MyLink.deleteBook(main_props, strId)}
          >
            本を削除する
          </button>
        </>
      );
    }
  }

  return <></>;
}

export default function UserProfile() {
  const [isFollowing, setIsFollowing]: any = useState(false);
  const [showingUser, setShowingUser]: any = useState(null);
  const props: any = useContext(PropsContext);
  const data: any = useContext(DataContext);
  const params: any = data.params;
  const user: any = params.user;
  const queryStrId: any = props.match.params.strId;
  const locationState: any = props.location.state;
  const setParams: any = useContext(SetParamsContext);

  useEffect(() => {
    setup();
  }, [queryStrId]);

  function setup() {
    // 自分のページから、他のユーザーのページに戻ろうとするときに初期化が必要。
    setShowingUser(null);

    function setUserData(user: any) {
      setShowingUser(user);
      setIsFollowing(followCheck(user));
    }

    // ユーザー画像やプロフィールなどをクリックしてきた場合 (そうでない場合はundefined)
    if (locationState) {
      const locationUser = locationState.user;
      setUserData(locationUser);

      // 自分自身の場合
    } else if (user && user.str_id === queryStrId) {
      setUserData(user);

      // URLを入力してきた場合
    } else {
      const path = '/api/user/profile/' + queryStrId;
      axios
        .get(path)
        .then((response: any) => {
          const canUpdate =
            props.history.location.pathname.indexOf('/user/profile/') === 0;
          // 検索中にページ遷移していた場合はstate更新しない
          if (canUpdate) {
            const user = response.data;
            setUserData(user);
          }
        })
        .catch(() => {
          alert('ユーザーの情報を取得できませんでした');
        });
    }
  }

  function handleFollow() {
    setIsFollowing(!isFollowing);

    onSubmitFollow();
  }

  function followCheck(tgUser: any) {
    // ログインしていない場合はfalseを返す
    if (typeof user === 'undefined') {
      return false;
    }
    const followers = tgUser.followers;

    const results = followers.find((follower: any) => {
      return follower.follower_id == user.id;
    });

    return typeof results !== 'undefined';
  }

  function onSubmitFollow() {
    let followers = showingUser.followers;
    let followings = user.followings;

    // フォロー済みの場合はfilterで削除
    if (isFollowing) {
      followers = followers.filter((follower: any) => {
        return follower.follower_id != user.id;
      });
      followings = followings.filter((following: any) => {
        return following.follow_id != showingUser.id;
      });

      // フォローしてない場合はpushでダミーを追加
    } else {
      const newFollower = {
        id: 0,
        follow_id: showingUser.id,
        follower_id: user.id,
      };

      followers.push(newFollower);
      followings.push(newFollower);
    }

    const newShowingUser = Object.assign({}, showingUser);
    newShowingUser.followers = followers;
    setShowingUser(newShowingUser);

    params.user.followings = followings;
    setParams(params);

    const path = '/api/follow';
    axios
      .post(path, {
        targetId: showingUser.id,
        isFollowing: isFollowing,
        viewerId: user.id,
      })
      .catch(() => {
        alert('フォロー動作ができませんでした');
      });
  }

  let buttons = null;

  // ログインしている場合はボタンを表示
  if (typeof user !== 'undefined') {
    buttons = (
      <>
        <EditUserButton user={showingUser} viewerStrId={user.str_id} />
        <FollowButton
          user={showingUser}
          viewerUser={user}
          isFollowing={isFollowing}
          handleFollow={handleFollow}
        />
      </>
    );
  }

  let dropdownMenu: any = false;
  if (showingUser) {
    if (user) {
      if (user.str_id === showingUser.str_id) {
        dropdownMenu = (
          <EditBookshelfButton
            user={showingUser}
            books={showingUser.books}
            viewerUser={user}
          />
        );
      }
    }

    return (
      <>
        <Subtitle subtitle="プロフィール" />
        <UserCard user={showingUser}>
          <FollowNumber
            follows={showingUser.followings}
            followers={showingUser.followers}
            onClick={(e: any) =>
              MyLink.followers(props, showingUser, e.target.dataset.link)
            }
          />
          {buttons}
        </UserCard>
        <div className="mb-5">
          <Bookshelf
            user={showingUser}
            genres={showingUser.genres}
            orderedBooks={showingUser.ordered_books}
            dropdownMenu={dropdownMenu}
          />
        </div>
      </>
    );
  } else {
    return <></>;
  }
}
