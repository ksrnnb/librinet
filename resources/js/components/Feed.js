import React, { useContext } from 'react';
import Like from './Like';
import { PropTypes } from 'prop-types';
import { PropsContext } from './MainColumn';
import { DataContext } from '../views/App';
import { BookIcon, CommentIcon, Trash } from './Icon';
import { MyLink } from '../functions/MyLink';

function BookCover(props) {
  const book = props.book;
  const main_props = useContext(PropsContext);
  const data = useContext(DataContext);

  function linkToBookProfile() {
    const isbn = book.isbn;
    const user = data.params.user;
    // PostしたユーザーのisInBookshelfを、閲覧しているユーザーが持っているかどうかで上書きする。
    const isbnMatchedBook = user.books.filter((book) => book.isbn === isbn);
    const hasBook = isbnMatchedBook.filter((book) => book.isInBookshelf).length;

    book.isInBookshelf = hasBook;
    MyLink.bookProfile(main_props, book);
  }

  let cover = null;
  if (book) {
    if (book.cover) {
      cover = (
        <img
          className="hover book-cover"
          src={book.cover}
          alt="book_image"
          onClick={linkToBookProfile}
        />
      );
    } else {
      cover = (
        <div className="hover no-book-cover" onClick={linkToBookProfile}>
          <BookIcon />
        </div>
      );
    }
  } else {
    cover = <img className="book-cover invisible" alt="book_image" />;
  }

  return cover;
}

function UserImage(props) {
  const user = props.user;
  const main_props = useContext(PropsContext);
  const userImageUrl = user.image || '/img/icon.svg';

  return (
    <img
      className="hover user-image"
      src={userImageUrl}
      alt="user-icon"
      onClick={() => MyLink.userProfile(main_props, user.str_id)}
    />
  );
}
function UserAndMessage(props) {
  const user = props.user;
  const message = props.message;

  return (
    <>
      <div className="user-name-wrapper">
        <p className="feed-user-name">{user.name}</p>
        <p className="feed-user-id ml-2">{'@' + user.str_id}</p>
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
    content = (
      <p className="book-info invisible">
        dummy message (this message will be hidden)
      </p>
    );
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

  const isPost = 'comments' in item;

  return (
    <div className="feed-wrapper" data-ispost={isPost}>
      <div className="feed shadow">
        <div className="book-cover-wrapper">
          <BookCover book={item.book} />
        </div>
        <div className="feed-body-wrapper">
          <div className="feed-body">
            <div className="user-image-wrapper">
              <UserImage user={item.user} />
            </div>
            <div className="feed-message">
              <UserAndMessage user={item.user} message={item.message}>
                {icons}
              </UserAndMessage>
            </div>
          </div>
          <div className="book-info-wrapper">
            <BookInfo item={item} />
          </div>
        </div>
      </div>
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
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

Feed.propTypes = {
  linkToComment: PropTypes.func,
};

UserImage.propTypes = {
  user: PropTypes.object,
};
