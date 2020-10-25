import React, { useState, useContext, useEffect } from 'react';
import Subtitle from './Subtitle';
import UserCard from './UserCard';
import Bookshelf from './Bookshelf';
import { DataContext } from './App';
import { PropsContext } from './Pages';
import { PropTypes } from 'prop-types';

const axios = window.axios;

function EditUserButton(props) {
  const user = props.user;
  const viewerStrId = props.viewerStrId;
  const pages_props = useContext(PropsContext);

  function linkToEditUser() {
    pages_props.history.push('/user/edit/' + user.str_id);
  }

  let EditUserButton;
  // 表示しているユーザーと、閲覧者が異なる場合は編集ボタン非表示
  if (user.str_id !== viewerStrId) {
    EditUserButton = <></>;

    // 表示しているユーザーが、閲覧者自身の場合
  } else {
    // ゲストの場合
    if (user.str_id === 'guest') {
      EditUserButton = (
        <div>
          <button type="button" className="btn btn-outline-success" disabled>
            ユーザー情報を編集する
          </button>
          <p className="text-danger mb-0">
            注意：ゲストユーザーは編集できません
          </p>
        </div>
      );
      // ゲスト以外の場合
    } else {
      EditUserButton = (
        <div>
          <button
            type="button"
            className="btn btn-outline-success d-block"
            onClick={linkToEditUser}
          >
            ユーザー情報を編集する
          </button>
        </div>
      );
    }
  }

  return EditUserButton;
}

function FollowButton(props) {
  const user = props.user;
  const viewerUser = props.viewerUser;

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
function FollowNumber(props) {
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

function EditBookshelfButton(props) {
  const hasLoaded = 'books' in props;
  console.log(props);
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
            onClick={() => {
              props.redirectToEditGenre(strId);
            }}
          >
            ジャンルを編集する
          </button>
          <button
            className="dropdown-item"
            type="button"
            onClick={() => {
              props.redirectToDeleteBook(strId);
            }}
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
  const [isFollowing, setIsFollowing] = useState(false);
  const [showingUser, setShowingUser] = useState(null);
  const props = useContext(PropsContext);
  const user = useContext(DataContext).params.user;

  useEffect(() => {
    setup();
  }, []);

  function setup() {
    function setUserData(user) {
      setShowingUser(user);
      setIsFollowing(followCheck(user));
    }

    const locationState = props.location.state;
    const queryStrId = props.match.params.strId;
    // const isSearched = locationState && (locationState.user.str_id === queryStrId);

    // TODO: ユーザー検索などでプロフィールページに来た後に、profileをクリックすると自分が表示されない。
    // ユーザー画像やプロフィールなどをクリックしてきた場合 (そうでない場合はundefined)
    if (locationState) {
      const user = locationState.user;
      setUserData(user);

      // プロフィールをクリックしてきた場合
      // ログインしてない場合もあるので、userが代入されているか確認
    } else if (user && user.str_id === queryStrId) {
      setUserData(user);

      // URLを入力してきた場合
    } else {
      const path = '/api/user/profile/' + props.match.params.strId;
      axios
        .get(path)
        .then((response) => {
          const user = response.data;
          setUserData(user);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  function handleFollow() {
    setIsFollowing(!isFollowing);

    onSubmitFollow();
  }

  function followCheck(tgUser) {
    // ログインしていない場合はfalseを返す
    if (typeof user === 'undefined') {
      return false;
    }
    const followers = tgUser.followers;

    const results = followers.find((follower) => {
      return follower.follower_id == user.id;
    });

    return typeof results !== 'undefined';
  }

  function onClickFollowers(e) {
    const url = props.match.url + e.target.dataset.link;
    window.scroll(0, 0);
    props.history.push(url);
  }

  function onSubmitFollow() {
    const path = '/api/follow';
    axios
      .post(path, {
        targetId: showingUser.id,
        isFollowing: isFollowing,
        viewerId: user.id,
      })
      .then((response) => {
        showingUser.followers = response.data;
        setShowingUser(showingUser);

        // ここのpushが大事.location.stateを利用しているためここも更新が必要。
        const url = props.match.url;
        props.history.push({
          pathname: url,
          state: { user: showingUser },
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function redirectToDeleteBook(strId) {
    const path = '/book/delete/' + strId;
    window.scroll(0, 0);
    props.history.push(path);
  }

  function redirectToEditGenre(strId) {
    const path = '/genre/edit/' + strId;
    window.scroll(0, 0);
    props.history.push(path);
  }

  let buttons = null;

  // TODO: たぶんダメだから修正
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

  let dropdownMenu = false;
  if (showingUser) {
    if (user) {
      if (user.str_id === showingUser.str_id) {
        dropdownMenu = (
          <EditBookshelfButton
            user={showingUser}
            books={showingUser.books}
            viewerUser={user}
            redirectToDeleteBook={redirectToDeleteBook}
            redirectToEditGenre={redirectToEditGenre}
          />
        );
      }
    }

    console.log(dropdownMenu);

    return (
      <>
        <Subtitle subtitle="プロフィール" />
        <UserCard user={showingUser}>
          <FollowNumber
            follows={showingUser.followings}
            followers={showingUser.followers}
            onClick={onClickFollowers}
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

FollowNumber.propTypes = {
  follows: PropTypes.array,
  followers: PropTypes.array,
  onClick: PropTypes.func,
};

EditBookshelfButton.propTypes = {
  user: PropTypes.object,
  books: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  viewerUser: PropTypes.object,
  redirectToDeleteBook: PropTypes.func,
  redirectToEditGenre: PropTypes.func,
};
