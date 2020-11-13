import React, { ReactNode } from 'react';
import { MyCard } from './MyCard';
import { BookIcon } from './Icon';
import { Book as BookInterface } from '../types/Interfaces';

export function BookImage(props: { book: BookInterface }) {
  const book = props.book;
  let image;

  if (book.cover) {
    image = <img className="img-fluid" src={book.cover} alt="book_image" />;
  } else {
    image = <BookIcon />;
  }

  return image;
}

export function BookInfo(props: BookCard) {
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

interface BookCard {
  book: BookInterface;
  children?: ReactNode;
}

export function BookCard(props: BookCard) {
  const book = props.book;

  return (
    <MyCard
      image={<BookImage book={book} />}
      body={<BookInfo book={book}>{props.children}</BookInfo>}
      addingClass="book-card"
    />
  );
}
