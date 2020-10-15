import React from 'react';
import BookImage from './BookImage';
import BookInfo from './BookInfo';
import { PropTypes } from 'prop-types';

export default function SelectBookCard(props) {
  const book = props.book;

  return (
    <div className="row">
      <div className="col-1">{props.children}</div>
      <BookImage col="col-3" book={book} />
      <BookInfo col="col-8" book={book}></BookInfo>
    </div>
  );
}

SelectBookCard.propTypes = {
  book: PropTypes.object,
  children: PropTypes.element,
};
