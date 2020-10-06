import React from 'react';

export default function BooksElement(props) {
  const books = props.books;
  const booksElement = books.map((book) => {
    const url = '/book/profile/' + book.isbn;

    let img = null;
    if (book.cover) {
      img = (
        <img className="img-fluid w-100" src={book.cover} alt="book-cover" />
      );
    } else {
      img = (
        <img className="img-fluid w-100" src="img/book.svg" alt="book-cover" />
      );
    }

    return (
      <div className="col-3" key={book.isbn}>
        <a href={url}>{img}</a>
      </div>
    );
  });

  return booksElement;
}
