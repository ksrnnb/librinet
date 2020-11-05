import React from 'react';
import PropTypes from 'prop-types';
import { MyCard } from './MyCard';
import { BookIcon } from './Icon';

export function BookImage(props: any) {
  const book = props.book;
  let image;

  if (book.cover) {
    image = <img className="img-fluid" src={book.cover} alt="book_image" />;
  } else {
    image = <BookIcon />;
  }

  return image;
}

BookImage.propTypes = {
  book: PropTypes.object,
  col: PropTypes.string,
};

export function BookInfo(props: any) {
  const book = props.book;
  const pub_year = book.pubdate.slice(0, 4) + '年';

  return (
    <>
      <p className="sub-caption">タイトル</p>
      <p>{book.title}</p>
      <p className="sub-caption">著者</p>
      <p>{book.author}</p>
      <p className="sub-caption">出版社</p>
      <p>{book.publisher}</p>
      <p className="sub-caption">出版年</p>
      <p>{pub_year}</p>
      {props.children}
    </>
  );
}

BookInfo.propTypes = {
  book: PropTypes.object,
  col: PropTypes.string,
  children: PropTypes.array,
};

export function BookCard(props: any) {
  const book = props.book;

  return (
    <MyCard
      image={<BookImage book={book} />}
      body={<BookInfo book={book}>{props.children}</BookInfo>}
      addingClass="book-card"
    />
  );
}

BookCard.propTypes = {
  book: PropTypes.object,
  children: PropTypes.array,
};
