import React from 'react';

export default function BookInfo(props) {
  const book = props.book;
  const pub_year = book.pubdate.slice(0, 4) + '年';

  return (
    <div className={props.col}>
      <p className="one-row">タイトル： {book.title}</p>
      <p className="one-row mt-3">著者：{book.author}</p>
      <p className="one-row mt-3">出版社：{book.publisher}</p>
      <p className="one-row mt-3">出版年：{pub_year}</p>
      {props.children}
    </div>
  );
}
