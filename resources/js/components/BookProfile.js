import React, { useContext, useEffect, useState } from 'react';
import { PropsContext } from './Pages';
import Subtitle from './Subtitle';
import SearchedBook from './SearchedBook';

export default function BookProfile() {

  const props = useContext(PropsContext);
  const isbn = props.match.params.isbn;
  const [book, setBook] = useState(null);
  const [isInBookshelf, setIsInBookshelf] = useState(null);


  useEffect(loadBooks, []);

  const path = '/api/book';
  function loadBooks() {
    axios
      .post(path, {
        isbn: isbn,
      })
      .then((response) => {
        const data = response.data;
        setBook(data.book);
        setIsInBookshelf(data.isInBookshelf);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  if (book) {
    return (
      <div className="row book">
        <Subtitle subtitle="本の情報" />
        <SearchedBook book={book} isInBookshelf={isInBookshelf} />
      </div>
    );
  } else {
    return <></>;
  }
}