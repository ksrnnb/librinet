import { PropsContext } from './MainColumn';
import { DataContext } from '../views/App';
import { BookCard } from './BookCard';
import React, { useContext } from 'react';
import { PropTypes } from 'prop-types';
import { MyLink } from '../functions/MyLink';

export default function SearchedBook(props) {
  const main_props = useContext(PropsContext);
  const data = useContext(DataContext);

  const book = props.book;
  const isInBookshelf = book.isInBookshelf;

  function PostButton() {
    const isLogin = data.isLogin;

    if (isLogin) {
      return (
        <button
          type="button"
          className="btn btn-outline-success mr-3"
          onClick={() => MyLink.post(main_props, book)}
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
          onClick={() => MyLink.addBook(main_props, book)}
        >
          本棚に追加する
        </button>
      );
    } else {
      return <></>;
    }
  }

  return (
    <BookCard book={book}>
      <PostButton isLogin={data.isLogin} />
      <AddBookButton />
    </BookCard>
  );
}

SearchedBook.propTypes = {
  book: PropTypes.object,
  isInBookshelf: PropTypes.bool,
};
