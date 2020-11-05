import { PropsContext } from './MyRouter';
import { DataContext } from '../views/App';
import { BookCard } from './BookCard';
import React, { useContext } from 'react';
import { MyLink } from '../functions/MyLink';

export default function SearchedBook(props: any) {
  const main_props: any = useContext(PropsContext);
  const data: any = useContext(DataContext);

  const book: any = props.book;
  const isInBookshelf: boolean = book.isInBookshelf;

  function PostButton() {
    const user: any = data.params.user;

    if (user) {
      return (
        <button
          type="button"
          className="btn btn-outline-success mr-3"
          onClick={() => MyLink.post(main_props, book)}
        >
          投稿する
        </button>
      );
    } else {
      return null;
    }
  }

  function AddBookButton() {
    const user = data.params.user;

    if (user && !isInBookshelf) {
      return (
        <button
          type="button"
          className="btn btn-outline-success"
          onClick={() => MyLink.addBook(main_props, book)}
        >
          本棚に追加する
        </button>
      );
    } else {
      return <></>;
    }
  }

  return (
    <BookCard book={book}>
      <PostButton />
      <AddBookButton />
    </BookCard>
  );
}
