import React from 'react';
import BookImage from './BookImage';
import BookInfo from './BookInfo';
import PropTypes from 'prop-types';

export default function BookCard(props) {
  const book = props.book;

  return (
    <div className="book-card row shadow no-gutters">
      <BookImage book={book} />
      <BookInfo book={book}>
        {props.children}
      </BookInfo>
    </div>
  );
}

BookCard.propTypes = {
  book: PropTypes.object,
  children: PropTypes.array,
};
