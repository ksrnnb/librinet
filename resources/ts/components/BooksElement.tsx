import React, { useContext } from 'react';
import { PropsContext } from './MyRouter';
import { BookIcon } from './Icon';
import { MyLink } from '../functions/MyLink';
import { Book } from '../types/Interfaces';
import { DataContext } from '../views/App';

export default function BooksElement(props: { books: Book[] }) {
  const routerProps = useContext(PropsContext);
  const data = useContext(DataContext);
  const books = props.books;

  // 本を持っているかどうか、確認してから本のページへ。
  const bookLink = (book: Book) => {
    const userBooks = data.params.user.books;

    // someメソッドで確認。
    book.isInBookshelf = userBooks.some((b) => b.id === book.id);

    MyLink.bookProfile(routerProps, book);
  };

  const booksElement = books.map((book: Book) => {
    const src = book.cover;

    return (
      <div className="col-3" key={book.isbn}>
        <div className="hover book" onClick={() => bookLink(book)}>
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

  return <>{booksElement}</>;
}
