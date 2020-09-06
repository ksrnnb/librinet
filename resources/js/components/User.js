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

    this.makeOneBookComponent = this.makeOneBookComponent.bind(this);
    this.makeGenreBookMap = this.makeGenreBookMap.bind(this);
    this.makeAllBooksComponents = this.makeAllBooksComponents.bind(this);
  }

  makeOneBookComponent(book) {
    return (
      <React.Fragment key={book.id}>
        {/* TODO: imageがない場合の処理を追加する。 */}
        {book.cover ? <img src={book.cover} alt='bookcover'/> : <p>no cover</p>}
        <p>{book.title}</p>
        <p>{book.author}</p>
      </React.Fragment>
    );
  }

  /*
    ジャンルIDと、そのジャンルに属する本のコンポーネントから成るMapを返す。
    {genre_id => そのジャンルに属する本, ...}
  */

  makeGenreBookMap(genres, books) {
    const genreIds = Object.keys(genres);

    return new Map(
      genreIds.map(genre_id => {
        const bookElements = books.map(book => {
          if (book.genre_id == genre_id) {
            return this.makeOneBookComponent(book);
          } else {
            return null;
          }
        });

        return [genre_id, bookElements];
      })
    );
  }

  /*
      ユーザーが登録した本をジャンルごとに分けて、すべて表示する。
      genreBookMap
      Map(n) {'genre_id' => ['bookのcomponentが入った配列'], ...}
  */
  makeAllBooksComponents(genreBookMap) {

    const components = [];

    genreBookMap.forEach((booksComponents, id) => {
      components.push(
        <React.Fragment key={'genre' + id}>
          <p className="h2">{genres[id]}</p>
              {booksComponents}
        </React.Fragment>
      );
    });

    return components;
  }
  
  render() {
    const books = this.props.books;
    const genres = this.props.genres;

    /*
      genreBookMap
      Map(n) {'genre_id' => ['bookのcomponentが入った配列'], ...}
    */
    const genreBookMap = this.makeGenreBookMap(genres, books);

    const allBooksComponents = this.makeAllBooksComponents(genreBookMap);

    return　(
      <React.Fragment>
        <p>Bookshelf</p>

        {/* TODO: Read/Want/Recommendに分けて表示。。。 */}
        {allBooksComponents}
        
      </React.Fragment>
    );
  }
}


if (document.getElementById('user-react')) {
    ReactDOM.render(<User />, document.getElementById('user-react'));
}
