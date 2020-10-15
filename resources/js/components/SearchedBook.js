import { PropsContext } from './Pages';
import { DataContext } from './App';
import BookCard from './BookCard';
import React, { useContext } from 'react';
import { PropTypes } from 'prop-types';

export default function SearchedBook(props) {
  const pages_props = useContext(PropsContext);
  const data = useContext(DataContext);
  const book = props.book;
  const isInBookshelf = props.isInBookshelf;

  function linkToPost() {
    const postUrl = '/book/post/' + book.isbn;
    pages_props.history.push(postUrl);
  }

  function linkToAddBookshelf() {
    const addUrl = '/book/add/' + book.isbn;
    pages_props.history.push(addUrl);
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
          本の投稿をする
        </button>
      );
    } else {
      return null;
    }
  }

  function AddBookButton(props) {
    if (props.isInBookshelf) {
      return <></>;
    } else {
      return (
        <button
          type="button"
          className="btn btn-outline-success"
          onClick={linkToAddBookshelf}
        >
          本棚に追加する
        </button>
      );
    }
  }

  return (
    <div className="row mt-5 book">
      <BookCard book={book}>
        <PostButton isLogin={data.isLogin} onClick={linkToPost} />
        <AddBookButton
          isInBookshelf={isInBookshelf}
          onClick={linkToAddBookshelf}
        />
      </BookCard>
    </div>
  );
}

SearchedBook.propTypes = {
  book: PropTypes.object,
  isInBookshelf: PropTypes.bool,
};
