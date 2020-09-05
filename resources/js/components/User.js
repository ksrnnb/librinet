import React from 'react';
import ReactDOM from 'react-dom';

class User extends React.Component {
  render() {
    const user = window.user;
    const books = window.books;
    const genres = window.genres;
    return (
        <div className="container">

          <Avator image={user.image} />
          <p>Id: {user.str_id}</p>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <BookShelf books={books} genres={genres}/>
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
    const genres = this.props.genres;

    console.log(books);
    console.log(genres);

    const genre_id = 1;

    const book_elements = books.map(book => {
      if (book.genre_id == genre_id) {
        return (
          <React.Fragment key={book.id}>
            {/* TODO: imageがない場合の処理を追加する。 */}
            {book.cover ? <img src={book.cover} alt='bookcover'/> : <p>no cover</p>}
            <p>{book.title}</p>
            <p>{book.author}</p>
          </React.Fragment>
        );
      }
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
