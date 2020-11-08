import React, { useContext, useEffect, useState } from 'react';
import { PropsContext } from '../components/MyRouter';
import Subtitle from '../components/Subtitle';
import SearchedBook from '../components/SearchedBook';
import { Book, Response, RouterProps } from '../types/Interfaces';

const axios = window.axios;

export default function BookProfile() {
  const props: RouterProps = useContext(PropsContext);
  const isbn: string = props.match.params.isbn;
  const [book, setBook] = useState<Book | null>(null);

  useEffect(loadBooks, []);

  function loadBooks() {
    const book: Book = props.location.state;

    book ? setBook(book) : getBookData();

    function getBookData() {
      axios
        .post('/api/book', {
          isbn: isbn,
        })
        .then((response: Response) => {
          setBook(response.data);
        });
    }
  }

  if (book) {
    return (
      <>
        <Subtitle subtitle="本の情報" />
        <SearchedBook book={book} />
      </>
    );
  } else {
    return <></>;
  }
}
