import React from 'react';

export default class BookCard extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const book = this.props.book;
    return (
      <div className="row">
        <BookImage book={book} />
        <BookInfo book={book}>
          {this.props.children}
        </BookInfo>
      </div>
    );
  }
}

function BookImage(props) {
  const book = props.book;
  let image;

  if (book.cover) {
    image = <img className="img-fluid" src={book.cover} alt="book_image" />;
  } else {
    image = (
      <img className="img-fluid" src="../img/book.svg" alt="book_image" />
    );
  }

  return (
    <div className="col-3">
      <figure className="mx-2 px-0 mb-0 book">{image}</figure>
    </div>
  );
}

function BookInfo(props) {
  const book = props.book;
  const pub_year = book.pubdate.slice(0, 4) + '年';

  return (
    <div className="col-9">
      <p className="one-row">タイトル： {book.title}</p>
      <p className="one-row mt-3">著者：{book.author}</p>
      <p className="one-row mt-3">出版社：{book.publisher}</p>
      <p className="one-row mt-3">出版年：{pub_year}</p>
      {props.children}
    </div>
  );
}