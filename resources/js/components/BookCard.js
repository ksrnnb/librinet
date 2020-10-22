import React from 'react';
import PropTypes from 'prop-types';
import { MyCard } from './MyCard';

export function BookImage(props) {
  const book = props.book;
  let image;

  if (book.cover) {
    image = <img className="img-fluid" src={book.cover} alt="book_image" />;
  } else {
    image = (
      <img className="img-fluid" src="../img/book.svg" alt="book_image" />
    );
  }

  return image;
}

BookImage.propTypes = {
  book: PropTypes.object,
  col: PropTypes.string,
};

export function BookInfo(props) {
  const book = props.book;
  const pub_year = book.pubdate.slice(0, 4) + '年';

  return (
    <>
      <p className="one-row">タイトル： {book.title}</p>
      <p className="one-row mt-3">著者：{book.author}</p>
      <p className="one-row mt-3">出版社：{book.publisher}</p>
      <p className="one-row mt-3">出版年：{pub_year}</p>
      {props.children}
    </>
  );
}

BookInfo.propTypes = {
  book: PropTypes.object,
  col: PropTypes.string,
  children: PropTypes.array,
};


export function BookCard(props) {
  const book = props.book;
  console.log(props);

  return (
    <MyCard
      image={<BookImage book={book} />}
      body={
        <BookInfo book={book}>
          {props.children}
        </BookInfo>
      }
      addingClass="book-card"
    />
  );
}

BookCard.propTypes = {
  book: PropTypes.object,
  children: PropTypes.array,
};
