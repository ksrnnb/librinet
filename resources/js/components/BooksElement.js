import React, { useContext } from 'react';
import { PropTypes } from 'prop-types';
import { PropsContext } from './Pages';
import { BookIcon } from './Icon';

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
    const src = book.cover;

    return (
      <div className="col-3" key={book.isbn}>
        <div className="hover" onClick={() => linkToBookProfile(book, url)}>
          {src ? (
            <img className="img-fluid" src={src} alt="book-cover" />
          ) : (
            <BookIcon />
          )}
          <p className="one-row">{book.title}</p>
        </div>
      </div>
    );
  });

  return booksElement;
}

BooksElement.propTypes = {
  books: PropTypes.array,
};
