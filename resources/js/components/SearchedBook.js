import { PropsContext } from './Pages';
import { DataContext } from './App';
import { BookCard } from './BookCard';
import React, { useContext } from 'react';
import { PropTypes } from 'prop-types';

export default function SearchedBook(props) {
  const pages_props = useContext(PropsContext);
  const data = useContext(DataContext);

  const book = props.book;
  const isInBookshelf = book.isInBookshelf;

  function linkToPost() {
    const postUrl = '/book/post/' + book.isbn;
    pages_props.history.push({
      pathname: postUrl,
      state: book,
    });
  }

  function linkToAddBookshelf() {
    const addUrl = '/book/add/' + book.isbn;
    pages_props.history.push({
      pathname: addUrl,
      state: book,
    });
  }

  function PostButton() {
    const isLogin = data.isLogin;

    if (isLogin) {
      return (
        <button
          type="button"
          className="btn btn-outline-success mr-3"
          onClick={linkToPost}
        >
          投稿する
        </button>
      );
    } else {
      return null;
    }
  }

  function AddBookButton() {
    const isLogin = data.isLogin;

    if (isLogin && !isInBookshelf) {
      return (
        <button
          type="button"
          className="btn btn-outline-success"
          onClick={linkToAddBookshelf}
        >
          本棚に追加する
        </button>
      );
    } else {
      return <></>;
    }
  }

  const isSearched = pages_props.location.pathname === '/book';
  const marginTop = isSearched ? "mt-5" : "";

  return (
    <div className={marginTop}>
      <BookCard book={book}>
        <PostButton isLogin={data.isLogin} onClick={linkToPost} />
        <AddBookButton onClick={linkToAddBookshelf} />
      </BookCard>
    </div>
  );
}

SearchedBook.propTypes = {
  book: PropTypes.object,
  isInBookshelf: PropTypes.bool,
};
