import React, { useState, useContext, useEffect } from 'react';
import Subtitle from '../components/Subtitle';
import UserCard from '../components/UserCard';
import Bookshelf from '../components/Bookshelf';
import { DataContext, SetParamsContext } from './App';
import { PropsContext } from '../components/MyRouter';
import { MyNav } from '../components/Components';
import { PostOfUser } from '../components/PostOfUser';
import { MyLink } from '../functions/MyLink';
import { User, Follower, Book } from '../types/Interfaces';

const axios = window.axios;

interface EditButtonProps {
  user: User;
  viewerStrId: string;
}

function EditUserButton(props: EditButtonProps) {
  const user = props.user;
  const viewerStrId = props.viewerStrId;
  const routerProps = useContext(PropsContext);

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
        onClick={() => MyLink.editUser(routerProps, user.str_id)}
      >
        ユーザー情報を編集する
      </button>
    </div>
  );
}

interface FollowProps {
  user: User;
  viewerUser: User;
  isFollowing: boolean;
  handleFollow: () => void;
}

function FollowButton(props: FollowProps) {
  const { user, viewerUser, isFollowing, handleFollow } = props;

  if (user.id == viewerUser.id) {
    return <></>;
  }

  let className, content;

  if (isFollowing) {
    className = 'btn btn-success d-block';
    content = 'フォロー中';
  } else {
    className = 'btn btn-outline-success d-block';
    content = 'フォローする';
  }

  const FollowButton = (
    <button className={className} onClick={handleFollow}>
      {content}
    </button>
  );

  return FollowButton;
}

interface FollowNumberProps {
  follows: Follower[];
  followers: Follower[];
  onClick: (e: any) => void;
}

function FollowNumber(props: FollowNumberProps) {
  const follows = props.follows.length;
  const followers = props.followers.length;
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
  const routerProps = useContext(PropsContext);

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
            onClick={() => MyLink.editGenre(routerProps, strId)}
          >
            ジャンルを編集する
          </button>
          <button
            className="dropdown-item"
            type="button"
            onClick={() => MyLink.deleteBook(routerProps, strId)}
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
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [showingUser, setShowingUser]: any = useState(null);
  const componentsList = {
    book: 'book',
    post: 'post',
    like: 'like',
  };

  const [component, setComponent] = useState<string>(componentsList.book);
  const props = useContext(PropsContext);
  const data = useContext(DataContext);
  const params = data.params;
  const user = params.user;
  const queryStrId = props.match.params.strId;
  const locationState = props.location.state;
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
    if (locationState && props.history.action === 'PUSH') {
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
      const newFollower: any = {
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

    const componentsObject = {} as any;

    componentsObject[componentsList.book] = (
      <Bookshelf
        user={showingUser}
        genres={showingUser.genres}
        orderedBooks={showingUser.ordered_books}
        dropdownMenu={dropdownMenu}
      />
    );

    componentsObject[componentsList.post] = (
      <PostOfUser posts={showingUser.posts} viewerId={user && user.id} />
    );

    // TODO: 実装
    componentsObject[componentsList.like] = <></>;

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
        <div className="row justify-content-around mx-0">
          <MyNav
            content="本棚"
            onClick={() => setComponent(componentsList.book)}
            isActive={component === componentsList.book}
            dusk={componentsList.book}
          />
          <MyNav
            content="投稿"
            onClick={() => setComponent(componentsList.post)}
            isActive={component === componentsList.post}
            dusk={componentsList.post}
          />
          <MyNav
            content="いいね"
            onClick={() => setComponent(componentsList.like)}
            isActive={component === componentsList.like}
            dusk={componentsList.like}
          />
        </div>
        <div className="mb-5">{componentsObject[component]}</div>
      </>
    );
  } else {
    return <></>;
  }
}
