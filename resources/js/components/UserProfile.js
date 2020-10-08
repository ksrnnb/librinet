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

    this.params = null;
    this.viewerUser = null;

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
    // console.log(this.props);
    this.setup();
  }

  // componentDidUpdate(prevProps) {
  //   if (this.props.id !== prevProps.id) {
  //     this.setup();
  //   }
  // }

  setup() {
    const props = this.props.props;
    const params = this.props.params;

    // ユーザー画像やプロフィールなどをクリックしてきた場合
    if (params) {
      this.params = params;
      this.viewerUser = params.user;

      const hasLoaded = true;
      const isFollowing = this.isFollowing();

      this.setState({
        hasLoaded: hasLoaded,
        isFollowing: isFollowing,
      });
      // 更新ボタンを押したり、直接URLから来た場合
    } else {
      const path = '/api/user/profile/' + props.match.params.strId;
      axios
        .get(path)
        .then((response) => {
          this.params = response.data;
          this.viewerUser = response.data.viewer_user;

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
    if (typeof this.viewerUser === 'undefined') {
      return false;
    }
    const followers = this.params.followers;
    const results = followers.find((follower) => {
      return follower.follower_id == this.viewerUser.id;
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
    const params = this.params;
    const viewerUser = this.viewerUser;
    const isFollowing = this.state.isFollowing;

    if (params != null) {
      let buttons = null;

      // ログインしている場合はボタンを表示
      if (typeof viewerUser !== 'undefined') {
        buttons = (
          <>
            <EditUserButton
              user={params.user}
              viewerStrId={viewerUser.str_id}
            />
            <FollowButton
              user={params.user}
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
          <UserCard user={params.user}>
            {buttons}
            <FollowNumber
              follows={params.follows}
              followers={params.followers}
            />
          </UserCard>
          <EditBookshelfButton
            user={params.user}
            books={params.books}
            viewerUser={viewerUser}
            redirectToDeleteBook={this.redirectToDeleteBook}
            redirectToEditGenre={this.redirectToEditGenre}
          />
          <Bookshelf
            user={params.user}
            genres={params.genres}
            genres_books={params.genres_books}
            props={this.props.props}
          />
        </>
      );
    } else {
      return <></>;
    }
  }
}
