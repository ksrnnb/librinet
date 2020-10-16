import React, { useContext, useEffect, useState } from 'react';
import { PropsContext } from './Pages';
import Subtitle from './Subtitle';
import SearchedBook from './SearchedBook';

const axios = window.axios;

export default function BookProfile() {
  const props = useContext(PropsContext);
  const isbn = props.match.params.isbn;
  const [book, setBook] = useState(null);

  useEffect(loadBooks, []);

  function loadBooks() {
    const book = props.location.state;

    book ? setBook(book) : getBookData();

    function getBookData() {
      axios
        .post('/api/book', {
          isbn: isbn,
        })
        .then((response) => {
          setBook(response.data);
        });
    }
  }

  if (book) {
    return (
      <div className="row book">
        <Subtitle subtitle="本の情報" />
        <SearchedBook book={book} />
      </div>
    );
  } else {
    return <></>;
  }
}
