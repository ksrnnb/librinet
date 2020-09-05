import React from 'react';
import ReactDOM from 'react-dom';

class User extends React.Component {
  render() {
    const user = window.user;
    const books = window.books;
    return (
        <div className="container">
          {/* {console.log(window.user)} */}
          <Avator image={user.image} />
          <p>Id: {user.str_id}</p>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <BookShelf books={books} />
        </div>
    );
  }
}

class Avator extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      //  TODO: 画像ファイルを出力できるようにする。
      <p>{this.props.image || 'avatar image is null'}</p>
    );
  }
}

class BookShelf extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const books = this.props.books;

    const book_elements = books.map(book => {
      return (
        <React.Fragment key={book.id}>
          {/* TODO: imageがない場合の処理を追加する。 */}
          {book.cover ? <img src={book.cover} alt='bookcover'/> : <p>no cover</p>}
          <p>{book.title}</p>
          <p>{book.author}</p>
        </React.Fragment>
      );
    });

    return　(
      <React.Fragment>
        <p>Bookshelf</p>

        {/* TODO: Read/Want/Recommendに分けて表示。。。 */}
        {book_elements}
        
      </React.Fragment>
    );
  }
}


if (document.getElementById('user-react')) {
    ReactDOM.render(<User />, document.getElementById('user-react'));
}
