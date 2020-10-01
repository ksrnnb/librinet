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

function FollowNumber(props) {
  const follows = props.params.follows.length;
  const followers = props.params.followers.length;
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
  }

  render() {
    // const strId = this.props.match.params.strId;

    // TODO: userがnull or undefinedの場合の処理
    const params = this.props.location.state.params;
    const user = this.props.location.state.params.user;
    const viewerStrId = this.props.location.state.viewerStrId;

    // followボタンは後で実装
    const FollowButton = null;
    //           <!-- フォロー表示 -->
    //               <div id="follower-react"></div>
    //                   <input type="hidden" id="follow_id" name="follow_id" value="{{$user->id}}">
    //                   <input type="hidden" id="follower_id" name="follower_id" value="{{Auth::id()}}">
    //                   <input type="hidden" id="is_following" value="{{$is_following}}">
    //                   <!-- TODO: ここは認証済みの場合のみ -->
    return (
      <>
        {/* <Subtitle subtitle="User Profile" />
        <div className="row">
          <div className="col-2">
            <UserImage user={user} />
          </div>
          <div className="col-10">
            <p className="h4">{user.name}</p>
            <p className="h5">{'@' + user.str_id}</p>
            <EditButton user={user} viewerStrId={viewerStrId} />
            {FollowButton}
            <FollowNumber params={params} />
          </div>
        </div>
        <Bookshelf genres={params.genres} genres_books={params.genres_books} /> */}
        <Subtitle subtitle="User Profile" />
        <UserCard user={user}>
          <EditButton user={user} viewerStrId={viewerStrId} />
          {FollowButton}
          <FollowNumber params={params} />
        </UserCard>
        <Bookshelf genres={params.genres} genres_books={params.genres_books} />
      </>
    );
  }

  //   <div class="row mt-5">
  //       <div class="col-6">
  //           <h2>本棚</h2>
  //       </div>

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
}
