import React, { useContext, useEffect, useState } from 'react';
import { PropsContext } from '../components/MyRouter';
import Subtitle from '../components/Subtitle';
import SearchedBook from '../components/SearchedBook';

const axios = window.axios;

export default function BookProfile() {
  const props: any = useContext(PropsContext);
  const isbn: string = props.match.params.isbn;
  const [book, setBook]: any = useState(null);

  useEffect(loadBooks, []);

  function loadBooks() {
    const book = props.location.state;

    book ? setBook(book) : getBookData();

    function getBookData() {
      axios
        .post('/api/book', {
          isbn: isbn,
        })
        .then((response: any) => {
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
