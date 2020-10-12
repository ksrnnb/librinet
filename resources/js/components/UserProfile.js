import React from 'react';
import Subtitle from './Subtitle';
import UserCard from './UserCard';
import Redirect from './Redirect';
import Bookshelf from './Bookshelf';

const axios = window.axios;

function EditUserButton(props) {
  const user = props.user;
  const viewerStrId = props.viewerStrId;

  let EditUserButton;
  // 表示しているユーザーと、閲覧者が異なる場合は編集ボタン非表示
  if (user.str_id !== viewerStrId) {
    EditUserButton = null;

    // 表示しているユーザーが、閲覧者自身の場合
  } else {
    // ゲストの場合
    if (user.str_id === 'guest') {
      EditUserButton = (
        <>
          <button type="button" className="btn btn-outline-success invalid">
            ユーザー情報を編集する
          </button>
          <p className="text-danger">注意：ゲストユーザーは編集できません</p>
        </>
      );
      // ゲスト以外の場合
    } else {
      EditUserButton = (
        <a href={'/user/edit/' + user.str_id}>
          <button type="button" className="btn btn-outline-success">
            ユーザー情報を編集する
          </button>
        </a>
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
      <p className="mt-3 mb-0">Follow: {follows}</p>
      <p>Follower: {followers}</p>
    </>
  );
}

function EditBookshelfButton(props) {
  const hasLoaded = 'books' in props;

  if (hasLoaded) {
    const canEdit = props.user.id == props.viewerUser.id;
    const isNotEmpty = props.books.length;
    const strId = props.user.str_id;

    if (canEdit && isNotEmpty) {
      return (
        <div className="col-6">
          <button
            type="submit"
            className="btn btn-outline-success"
            onClick={() => {
              props.redirectToEditGenre(strId);
            }}
          >
            ジャンルを編集する
          </button>
          <button
            type="submit"
            className="btn btn-outline-danger"
            onClick={() => {
              props.redirectToDeleteBook(strId);
            }}
          >
            本を削除する
          </button>
        </div>
      );
    }
  }

  return <></>;
}

export default class UserProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasLoaded: false,
      isFollowing: false,
    };

    this.setup = this.setup.bind(this);
    this.handleFollow = this.handleFollow.bind(this);
    this.isFollowing = this.isFollowing.bind(this);
    this.onSubmitFollow = this.onSubmitFollow.bind(this);
    this.redirectToDeleteBook = this.redirectToDeleteBook.bind(this);
    this.redirectToEditGenre = this.redirectToEditGenre.bind(this);
  }

  componentDidMount() {
    // TODO: userがnull or undefinedの場合の処理
    // const params = this.props.location.state.params;
    this.setup();
  }

  // TODO: 他のユーザーのページから自分のプロフィールのページへ遷移しようとするとダメ。
  // componentDidUpdate(prevProps) {
  //   if (this.props.id !== prevProps.id) {
  //     this.setup();
  //   }
  // }

  setup() {
    const props = this.props.props;
    const params = this.props.params;
    const locationState = this.props.props.location.state;
    const queryStrId = this.props.props.match.params.strId;

    // ユーザー画像やプロフィールなどをクリックしてきた場合 (そうでない場合はundefined)
    if (locationState) {
      this.showingUserParams = locationState.params;
      // console.log(this.showingUser);
      const hasLoaded = true;
      const isFollowing = this.isFollowing();

      this.setState({
        hasLoaded: hasLoaded,
        isFollowing: isFollowing,
      });

      // プロフィールをクリックしてきた場合
    } else if (params.user.str_id === queryStrId) {
      this.showingUserParams = params;
      const hasLoaded = true;
      const isFollowing = this.isFollowing();

      this.setState({
        hasLoaded: hasLoaded,
        isFollowing: isFollowing,
      });

      // URLを入力してきた場合
    } else {
      const path = '/api/user/profile/' + props.match.params.strId;
      axios
        .get(path)
        .then((response) => {
          this.showingUserParams = response.data;

          const hasLoaded = true;
          const isFollowing = this.isFollowing();

          this.setState({
            hasLoaded: hasLoaded,
            isFollowing: isFollowing,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  handleFollow() {
    const isFollowing = !this.state.isFollowing;
    this.setState({
      isFollowing: isFollowing,
    });

    this.onSubmitFollow();
  }

  isFollowing() {
    // ログインしていない場合はfalseを返す
    const user = this.props.params.user;
    if (typeof user === 'undefined') {
      return false;
    }

    const followers = this.props.params.followers;
    const results = followers.find((follower) => {
      return follower.follower_id == user.id;
    }, this);

    return typeof results !== 'undefined';
  }

  onSubmitFollow() {
    const path = '/api/follow';
    axios
      .post(path, {
        targetId: this.params.user.id,
        isFollowing: this.state.isFollowing,
        viewerId: this.viewerUser.id,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  redirectToDeleteBook(strId) {
    Redirect.deleteBook.call(this, strId);
  }

  redirectToEditGenre(strId) {
    Redirect.editGenre.call(this, strId);
  }

  render() {
    // paramsには見ているページのユーザーの情報（本を含めて）が入っている。
    const hasLoaded = this.state.hasLoaded;
    const params = this.props.params;
    const viewerUser = params.user;
    const showingUserParams = this.showingUserParams;
    const isFollowing = this.state.isFollowing;

    // console.log('---------viewer----------');
    // console.log(viewerUser);
    // console.log('---------showing----------');
    // console.log(showingUser);
    if (hasLoaded) {

      let buttons = null;

      // TODO: たぶんダメだから修正
      // ログインしている場合はボタンを表示
      if (typeof viewerUser !== 'undefined') {
        buttons = (
          <>
            <EditUserButton
              user={viewerUser}
              viewerStrId={viewerUser.str_id}
            />
            <FollowButton
              user={viewerUser}
              viewerUser={viewerUser}
              isFollowing={isFollowing}
              handleFollow={this.handleFollow}
            />
          </>
        );
      }

      return (
        <>
          <Subtitle subtitle="User Profile" />
          <UserCard user={showingUserParams.user}>
          </UserCard>
          {buttons}
          <FollowNumber
            follows={showingUserParams.follows}
            followers={showingUserParams.followers}
          />
          <EditBookshelfButton
            user={showingUserParams.user}
            books={showingUserParams.books}
            viewerUser={viewerUser}
            redirectToDeleteBook={this.redirectToDeleteBook}
            redirectToEditGenre={this.redirectToEditGenre}
          />
          <Bookshelf
            user={showingUserParams}
            genres={showingUserParams.genres}
            genres_books={showingUserParams.genres_books}
            props={this.props.props}
          />
        </>
      );
    } else {
      return <></>;
    }
  }
}
