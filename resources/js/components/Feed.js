import React, { useContext } from 'react';
import Like from './Like';
import { PropTypes } from 'prop-types';
import { PropsContext } from './Pages';
import { DataContext } from './App';
import { CommentIcon, Trash } from './Icon';

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
      <div className="book-cover-wrapper">
        <img
          className="hover book-cover"
          src={coverUrl}
          alt="book_image"
          onClick={linkToBookProfile}
        />
      </div>
    );
  } else {
    cover = (
      <div className="book-cover-wrapper">
        <img
          className="book-cover invisible"
          src='/img/book.svg'
          alt="book_image"
        />
      </div>
    );
  }

  return cover;
}

function UserImage(props) {
  const user = props.user;
  const pages_props = useContext(PropsContext);
  const userImageUrl = user.image || '/img/icon.svg';

  function linkToUserProfile() {
    const userUrl = '/user/profile/' + user.str_id;
    pages_props.history.push(userUrl);
  }

  return (
    <div className="user-image-wrapper">
      <img
        className="hover user-image"
        src={userImageUrl}
        alt="user-icon"
        onClick={linkToUserProfile}
      />
    </div>
  );
}
function UserAndMessage(props) {
  const user = props.user;
  const message = props.message;

  return (
    <>
      <div>
        <p className="d-inline feed-user-name">{user.name}</p>
        <p className="d-inline ml-2 feed-user-id">{'@' + user.str_id}</p>
      </div>
      <p className="d-block feed-user-message">{message}</p>
      {props.children}
    </>
  );
}

function BookInfo(props) {
  const book = props.item.book;
  let content = null;
  if (book) {
    content = (
      <p className="book-info">
        {book.title} （ {book.author} ）
      </p>
    );
  } else {
    content = <p className="book-info invisible">dummy message (this message will be hidden)</p>
  }

  return content;
}

export default function Feed(props) {
  const item = props.item;
  const icons = (
    <div className="icon-group">
      <CommentIcon item={item} linkToComment={props.linkToComment} />
      <Like item={item} viewerId={props.viewerId} />
      <Trash
        item={item}
        viewerId={props.viewerId}
        onClick={props.onClickDelete}
      />
    </div>
  );

  return (
    <div className="feed-wrapper border">
      <div className="feed">
        <div className="feed-image">
          <BookCover book={item.book} />
          <UserImage user={item.user} />
        </div>
        <div className="feed-message">
          <UserAndMessage user={item.user} message={item.message}>
            {icons}
          </UserAndMessage>
        </div>
      </div >
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
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
};

Feed.propTypes = {
  linkToComment: PropTypes.func,
};
