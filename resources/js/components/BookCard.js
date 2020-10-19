import React from 'react';
import BookImage from './BookImage';
import BookInfo from './BookInfo';
import PropTypes from 'prop-types';

export default function BookCard(props) {
  const book = props.book;

  return (
    <div className="row book-card">
      <BookImage col="col-3" book={book} />
      <BookInfo col="col-9" book={book}>
        {props.children}
      </BookInfo>
    </div>
  );
}

BookCard.propTypes = {
  book: PropTypes.object,
  children: PropTypes.array,
};
