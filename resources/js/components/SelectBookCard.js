import React from 'react';
import BookImage from './BookImage';
import BookInfo from './BookInfo';

export default class SelectBookCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const book = this.props.book;

    return (
      <div className="row">
        <div className="col-1">{this.props.children}</div>
        <BookImage col="col-3" book={book} />
        <BookInfo col="col-8" book={book}></BookInfo>
      </div>
    );
  }
}
