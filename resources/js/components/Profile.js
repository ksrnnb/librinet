import React from 'react';
import Subtitle from './Subtitle';
import UserCard from './UserCard';
const axios = window.axios;

function Bookshelf(props) {
  const genres = props.genres;
  const genres_books = props.genres_books;
  const bookshelfElement = [
    <h2 className="mt-5 mb-0" key="bookshelf">
      本棚
    </h2>,
  ];

  // TODO 本がない場合を確認。null?
  if (genres_books == null) {
    bookshelfElement.push(
      <div className="row" key="nobook">
        <div className="col-12">
          <p className="text-danger">本棚に本がありません</p>
          {/* TODO: ここは自分にしか見えないように */}
          <p>本棚に本を追加しましょう！</p>
          <a href="/book">
            <button type="button" className="btn btn-outline-success">
              本を探す
            </button>
          </a>
        </div>
      </div>
    );
  } else {
    bookshelfElement.push(
      Object.keys(genres_books).map((genreId) => {
        const books = genres_books[genreId];

        const booksElement = books.map((book) => {
          const url = '/book/profile/' + book.isbn;

          let img = null;
          if (book.cover) {
            img = (
              <img
                className="img-fluid w-100"
                src={book.cover}
                alt="book-cover"
              />
            );
          } else {
            img = (
              <img
                className="img-fluid w-100"
                src="img/book.svg"
                alt="book-cover"
              />
            );
          }

          return (
            <div className="col-3" key={book.isbn}>
              <a href={url}>{img}</a>
            </div>
          );
        });

        return (
          <div className="row" key={genreId}>
            <div className="col-12">
              <h2 className="mt-5">{genres[genreId]}</h2>
            </div>
            {booksElement}
          </div>
        );
      })
    );
  }

  return bookshelfElement;
}

function EditButton(props) {
  const user = props.user;
  const viewerStrId = props.viewerStrId;

  let EditButton;
  // 表示しているユーザーと、閲覧者が異なる場合は編集ボタン非表示
  if (user.str_id !== viewerStrId) {
    EditButton = null;

    // 表示しているユーザーが、閲覧者自身の場合
  } else {
    // ゲストの場合
    if (user.str_id === 'guest') {
      EditButton = (
        <>
          <button type="button" className="btn btn-outline-success invalid">
            ユーザー情報を編集する
          </button>
          <p className="text-danger">注意：ゲストユーザーは編集できません</p>
        </>
      );
      // ゲスト以外の場合
    } else {
      EditButton = (
        <a href={'/user/edit/' + user.str_id}>
          <button type="button" className="btn btn-outline-success">
            ユーザー情報を編集する
          </button>
        </a>
      );
    }
  }

  return EditButton;
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

export default class Profile extends React.Component {
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

  render() {
    // paramsには見ているページのユーザーの情報（本を含めて）が入っている。
    const params = this.params;
    const viewerUser = this.viewerUser;
    const isFollowing = this.state.isFollowing;

    if (params != null) {
      let buttons = null;

      // ログインしている場合はボタンを表示
      if (typeof viewUser !== 'undefined') {
        buttons = (
          <>
            <EditButton user={params.user} viewerStrId={viewerUser.str_id} />
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
          <Bookshelf
            genres={params.genres}
            genres_books={params.genres_books}
          />
        </>
      );
    } else {
      return <></>;
    }
  }
}

//       <!-- 編集機能 -->
//       @if ($user->id == $auth_id)
//           @if ($genres_books->isNotEmpty())
//               <div class="col-6">

//                   <a href="{{'/book/edit/' . $user->str_id}}">
//                       <button type="submit" class="btn btn-outline-success">ジャンルを編集する</button>
//                   </a>
//                   <a href="{{'/book/delete/' . $user->str_id}}">
//                       <button type="submit" class="btn btn-outline-danger">本を削除する</button>
//                   </a>
//               </div>
//           @endif
//       @endif
//   </div>
//
//   </div>
