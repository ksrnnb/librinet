import React, { useContext } from 'react';
import Like from './Like';
import { PropsContext } from './MyRouter';
import { DataContext } from '../views/App';
import { BookIcon, CommentIcon, Trash } from './Icon';
import { MyLink } from '../functions/MyLink';
import { Book } from '../types/Interfaces';
import { getDeltaTimeMessage } from '../functions/TimeFunctions';

function BookCover(props: any) {
  const book: Book = props.book;
  const main_props: any = useContext(PropsContext);
  const data: any = useContext(DataContext);

  function linkToBookProfile() {
    const isbn: string = book.isbn;
    const user: any = data.params.user;

    // PostしたユーザーのisInBookshelfを、閲覧しているユーザーが持っているかどうかで上書きする。
    const isbnMatchedBooks: Book[] = user.books.filter(
      (book: Book) => book.isbn === isbn
    );

    const hasBook: boolean =
      isbnMatchedBooks.filter((book: Book) => book.isInBookshelf).length > 0;

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

function UserImage(props: any) {
  const user: any = props.user;
  const main_props: any = useContext(PropsContext);
  const userImageUrl: string = user.image || '/img/icon.svg';

  return (
    <img
      className="hover user-image"
      src={userImageUrl}
      alt="user-icon"
      onClick={() => MyLink.userProfile(main_props, user.str_id)}
    />
  );
}

function UserAndMessage(props: any) {
  const { user, message, created_at } = props.item;
  const timeMessage: string = getDeltaTimeMessage(created_at);
  return (
    <>
      <div className="user-name-wrapper">
        <p className="feed-user-name">{user.name}</p>
        <p className="feed-user-id ml-2">{'@' + user.str_id}</p>
        <p className="feed-time">{timeMessage}</p>
      </div>
      <p className="d-block feed-user-message">{message}</p>
      {props.children}
    </>
  );
}

function BookInfo(props: any) {
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

export default function Feed(props: any) {
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
    <div className="feed-wrapper">
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
              <UserAndMessage item={item}>{icons}</UserAndMessage>
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
