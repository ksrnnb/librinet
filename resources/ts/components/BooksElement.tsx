import React, { useContext } from 'react';
import { PropsContext } from './MyRouter';
import { BookIcon } from './Icon';
import { MyLink } from '../functions/MyLink';
import { Book } from '../types/Interfaces';

export default function BooksElement(props: any) {
  const main_props = useContext(PropsContext);
  const books = props.books;
  const booksElement = books.map((book: Book) => {
    const src = book.cover;

    return (
      <div className="col-3" key={book.isbn}>
        <div
          className="hover"
          onClick={() => MyLink.bookProfile(main_props, book)}
        >
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
