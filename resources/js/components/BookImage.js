import React from 'react';

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
    <div className={props.col}>
      <figure className="mx-2 px-0 mb-0 book">{image}</figure>
    </div>
  );
}
