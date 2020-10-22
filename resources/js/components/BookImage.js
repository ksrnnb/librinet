import React from 'react';
import PropTypes from 'prop-types';

export default function BookImage(props) {
  const book = props.book;
  let image;

  if (book.cover) {
    image = <img className="img-fluid" src={book.cover} alt="book_image" />;
  } else {
    image = (
      <img className="img-fluid" src="../img/book.svg" alt="book_image" />
    );
  }

  return (
    <div className="col-3 book-cover">
      {image}
    </div>
  );
}

BookImage.propTypes = {
  book: PropTypes.object,
  col: PropTypes.string,
};
