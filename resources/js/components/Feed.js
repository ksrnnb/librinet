import React from 'react';
import Like from './Like';
import { PropTypes } from 'prop-types';

function BookCover(props) {
  const book = props.book;
  let cover = null;
  if (book) {
    const bookUrl = '/book/profile/' + book.isbn;
    const coverUrl = book.cover || '/img/book.svg';

    cover = (
      <div className="col-3">
        <figure className="mx-2 px-0 mb-0 book">
          <a href={bookUrl}>
            <img className="img-fluid" src={coverUrl} alt="book_image" />
          </a>
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
  const userUrl = '/user/profile/' + user.str_id;
  const userImageUrl = user.image || '/img/icon.svg';

  return (
    <div className="col-9">
      <div className="row">
        <div className="avator col-2">
          <a href={userUrl}>
            <img className="img-fluid" src={userImageUrl} alt="user-icon" />
          </a>
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
  const isPost = 'comments' in props.item;

  let button = null;
  if (isPost) {
    const postUrl = '/comment/' + props.item.uuid;
    button = (
      <a href={postUrl}>
        <button type="button" className="btn btn-outline-info">
          Comment
        </button>
      </a>
    );
  }

  return button;
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
        <CommentButton item={item} />
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
