import React, { useContext } from 'react';
import Like from './Like';
import { PropTypes } from 'prop-types';
import { PropsContext } from './Pages';
import { DataContext } from './App';

function BookCover(props) {
  const book = props.book;
  const pages_props = useContext(PropsContext);
  const data = useContext(DataContext);

  function linkToBookProfile() {
    const isbn = book.isbn;
    const user = data.params.user;
    // PostしたユーザーのisInBookshelfを、閲覧しているユーザーが持っているかどうかで上書きする。
    const isbnMatchedBook = user.books.filter((book) => book.isbn === isbn);
    const hasBook = isbnMatchedBook.filter((book) => book.isInBookshelf).length;

    book.isInBookshelf = hasBook;

    const path = '/book/profile/' + book.isbn;
    pages_props.history.push({
      pathname: path,
      state: book,
    });
  }

  let cover = null;
  if (book) {
    const coverUrl = book.cover || '/img/book.svg';

    cover = (
      <div className="col-3">
        <figure className="mx-2 px-0 mb-0 book">
          <img
            className="img-fluid hover"
            src={coverUrl}
            alt="book_image"
            onClick={linkToBookProfile}
          />
        </figure>
      </div>
    );
  } else {
    cover = <div className="col-3"></div>;
  }

  return cover;
}

function UserAndMessage(props) {
  const user = props.user;
  const message = props.message;
  const userImageUrl = user.image || '/img/icon.svg';
  const pages_props = useContext(PropsContext);

  function linkToUserProfile() {
    const userUrl = '/user/profile/' + user.str_id;
    pages_props.history.push(userUrl);
  }

  return (
    <div className="col-9">
      <div className="row">
        <div className="avator col-2">
          <img
            className="img-fluid hover"
            src={userImageUrl}
            alt="user-icon"
            onClick={linkToUserProfile}
          />
        </div>
        <div className="col-10">
          <p className="h4 d-inline mr-2">{user.name}</p>
          <p className="d-inline">{'@' + user.str_id}</p>
          <p className="message">{message}</p>
          {props.children}
        </div>
      </div>
    </div>
  );
}

function CommentButton(props) {
  const button = (
    <button
      type="button"
      className="btn btn-outline-info"
      onClick={props.linkToComment}
    >
      Comment
    </button>
  );

  const isPost = 'comments' in props.item;

  return isPost ? button : null;
}

function DeleteButton(props) {
  const item = props.item;
  const viewerId = props.viewerId;
  const isPost = 'comments' in props.item;

  let button = null;
  if (item.user_id == viewerId) {
    button = (
      <button
        className="btn btn-outline-danger"
        name="delete"
        onClick={props.onClick}
        data-uuid={item.uuid}
        data-ispost={isPost}
      >
        削除する
      </button>
    );
  }

  return button;
}

function BookInfo(props) {
  const book = props.item.book;
  let content = null;
  if (book) {
    content = (
      <p className="one-row my-2">
        {book.title} （ {book.author} ）
      </p>
    );
  }

  return content;
}

// TODO: 高さ固定
export default function Feed(props) {
  const item = props.item;
  return (
    <div className="feed row border py-2">
      <BookCover book={item.book} />
      <UserAndMessage user={item.user} message={item.message}>
        <CommentButton item={item} linkToComment={props.linkToComment} />
        <Like item={item} viewerId={props.viewerId} />
        <DeleteButton
          item={item}
          viewerId={props.viewerId}
          onClick={props.onClickDelete}
        />
      </UserAndMessage>
      <BookInfo item={item} />
    </div>
  );
}

Feed.propTypes = {
  item: PropTypes.object,
  viewerId: PropTypes.number,
  onClickDelete: PropTypes.func,
};

UserAndMessage.propTypes = {
  user: PropTypes.object,
  message: PropTypes.string,
  children: PropTypes.array,
};

Feed.propTypes = {
  linkToComment: PropTypes.func,
};
