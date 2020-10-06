import React from 'react';
import BookCard from './BookCard';
import Genres from './Genres';
const axios = window.axios;

function Book(props) {
  const book = props.book;
  return (
    <>
      <p className="mt-4">本の情報</p>
      <BookCard book={book} />
    </>
  );
}

export default class GenreSelectFormat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      book: null,
      genres: null,
      isChecked: true,
      isNewGenre: true,
      message: '',
      newGenre: '',
      convGenre: '',
      errors: [],
    };

    this.getParams = this.getParams.bind(this);
    this.onClickConvGenre = this.onClickConvGenre.bind(this);
    this.onClickNewGenre = this.onClickNewGenre.bind(this);
    this.onChangeConvGenre = this.onChangeConvGenre.bind(this);
    this.onChangeNewGenre = this.onChangeNewGenre.bind(this);
    this.onChangeMessage = this.onChangeMessage.bind(this);
    this.onChangeRadioButton = this.onChangeRadioButton.bind(this);
    this.setBook = this.setBook.bind(this);
    this.setInitialConvGenre = this.setInitialConvGenre.bind(this);
  }

  componentDidMount() {
    // const params = this.props.props.location.state;
    // console.log(params);
    // if (params) {
    //   this.setBook(params);
    // } else {

    // 上の書き方だと、投稿後に更新ボタンを押したとき、投稿したことが反映されない
    const isbn = this.props.props.match.params.isbn;
    this.getBookData(isbn);
  }

  getBookData(isbn) {
    const path = '/api/book/post/' + isbn;
    axios
      .get(path)
      .then((response) => {
        this.setBook(response.data);
      })
      .catch(() => {
        this.props.props.history.push('/login');
      });
  }

  getParams() {
    const book = this.state.book;
    const params = {
      isbn: book.isbn,
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      pubdate: book.pubdate,
      cover: book.cover,
      message: this.state.message,
      add_to_bookshelf: this.state.isChecked,
      is_new_genre: this.state.isNewGenre,
      new_genre: this.state.newGenre,
      genre_id: this.state.convGenre,
    };

    return params;
  }

  onClickConvGenre() {
    this.setState({
      isNewGenre: false,
      newGenre: '',
    });
  }

  onClickNewGenre() {
    this.setState({
      isNewGenre: true,
    });
  }

  onChangeConvGenre(e) {
    const genreId = e.target.value;
    this.setState({
      convGenre: genreId,
    });
  }

  onChangeNewGenre(e) {
    const newGenre = e.target.value;
    this.setState({
      newGenre: newGenre,
    });
  }

  onChangeMessage(e) {
    const message = e.target.value;
    this.setState({
      message: message,
    });
  }

  onChangeRadioButton() {
    const isNewGenre = !this.state.isNewGenre;
    let newGenre = this.state.newGenre;
    if (!isNewGenre) {
      newGenre = '';
    }

    this.setState({
      isNewGenre: isNewGenre,
      newGenre: newGenre,
    });
  }

  setBook(params) {
    const isChecked = !params.book.isInBookshelf;

    this.setState({
      book: params.book,
      genres: params.genres,
      isChecked: isChecked,
    });

    this.setInitialConvGenre(params.genres);
  }

  setInitialConvGenre(genres) {
    const keys = Object.keys(genres);
    const hasGenres = keys.length;

    if (hasGenres) {
      const iniValue = keys[0];

      this.setState({
        convGenre: iniValue,
      });
    }
  }

  render() {
    const book = this.state.book;
    const genres = this.state.genres;
    const message = this.state.message;
    const convGenre = this.state.convGenre;
    const newGenre = this.state.newGenre;
    const isChecked = this.state.isChecked;
    const isNewGenre = this.state.isNewGenre;
    if (book) {
      return (
        <>
          <Genres
            book={book}
            isChecked={isChecked}
            isNewGenre={isNewGenre}
            genres={genres}
            newGenre={newGenre}
            convGenre={convGenre}
            onChangeNewGenre={this.onChangeNewGenre}
            onClickNewGenre={this.onClickNewGenre}
            onClickConvGenre={this.onClickConvGenre}
            onChangeConvGenre={this.onChangeConvGenre}
            onChangeRadioButton={this.onChangeRadioButton}
          />
          <Book book={book} />
        </>
      );
    } else {
      return <h2 className="無効なリクエストです"></h2>;
    }
  }
}
