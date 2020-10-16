import React, { useContext } from 'react';
import { PropTypes } from 'prop-types';
import { PropsContext } from './Pages';

export default function BooksElement(props) {
  const pages_props = useContext(PropsContext);
  function linkToBookProfile(book, url) {
    pages_props.history.push({
      pathname: url,
      state: book,
    });
  }

  const books = props.books;
  const booksElement = books.map((book) => {
    const url = '/book/profile/' + book.isbn;
    const src = book.cover || 'img/book.svg';

    return (
      <div className="col-3" key={book.isbn}>
        <img
          className="img-fluid w-100 hover"
          src={src}
          alt="book-cover"
          onClick={() => linkToBookProfile(book, url)}
        />
      </div>
    );
  });

  return booksElement;
}

BooksElement.propTypes = {
  books: PropTypes.array,
};
