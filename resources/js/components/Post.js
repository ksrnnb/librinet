import React from 'react';
import Subtitle from './Subtitle';
import BookCard from './BookCard';

const axios = window.axios;

function AddToBookshelf(props) {
  const book = props.book;
  const isChecked = props.isChecked;

  let className, isDisabled, message, value;

  if (book.isInBookshelf) {
    className = 'invalid';
    isDisabled = true;
    message = <p>(本棚に追加済みです)</p>;
    value = '0';
  } else {
    className = '';
    isDisabled = false;
    message = null;
    value = '1';

  }

  return (
    <>
      <label className={className} htmlFor="add-book">
        <input
          type="checkbox"
          name="add-book"
          id="add-book"
          value={value}
          checked={isChecked}
          disabled={isDisabled}
          onChange={props.onChange}
        />
          本棚に追加
      </label>
      {message}
    </>
  );
}

function NewGenre(props) {
  const canSelectGenre = props.canSelectGenre;
  const newGenre = props.newGenre;
  let disabled = !canSelectGenre;

  const isChecked = props.isNewGenre;
  // もし選択されてなかったら強制的にdisable?
  // if (!isNewGenre) {
  //   disabled = true;
  // }

  return (
    <>
      <p>ジャンルの選択</p>
      <label htmlFor="new">
        <input
          type="radio"
          name="genre"
          id="new"
          value="new"
          checked={isChecked}
          onChange={props.onChangeRadioButton}
          disabled={disabled} />
             新しいジャンルを入力
      </label>
      <label className="d-block" htmlFor="new_genre">
        <input
          type="text"
          name="new_genre"
          id="new-input"
          value={newGenre}
          disabled={disabled}
          onClick={props.onClickNewGenre}
          onChange={props.onChange}
        />
      </label>
    </>
  );
}

function ConventionalGenre(props) {

  const canSelectGenre = props.canSelectGenre;
  let disabled = !canSelectGenre;

  const isChecked = !props.isNewGenre;
  // もし選択されてなかったら強制的にdisable?
  // if (isNewGenre) {
  //   disabled = true;
  // }

  const genres = props.genres;
  const genresExist = Object.keys(genres).length;

  if (genresExist) {
    const genreElements = Object.keys(genres).map(id => {
      return <option value={id} key={id} name="genre_id">{genres[id]}</option>
    });

    return (
      <>
        <label htmlFor="conventional">
          <input
            type="radio"
            name="genre"
            id="conventional"
            value="conventional"
            checked={isChecked}
            disabled={disabled}
            onChange={props.onChangeRadioButton}
          />
            既存のジャンルから選択
        </label>
        <select
          name="genre_id"
          className="d-block"
          id="convSelect"
          disabled={disabled}
          value={props.convGenre}
          onClick={props.onClickConvGenre}
          onChange={props.onChangeConvGenre}
        >
          {genreElements}
        </select>
      </>
    );
  } else {
    return <></>;
  }
}

function Genres(props) {
  const canSelectGenre = props.isChecked;
  const newGenre = props.newGenre;
  let divClass;

  if (canSelectGenre) {
    divClass = "";
  } else {
    divClass = "invalid";
  }

  const element = (
    <div className={divClass}>
      <NewGenre
        canSelectGenre={canSelectGenre}
        isNewGenre={props.isNewGenre}
        newGenre={newGenre}
        onClickNewGenre={props.onClickNewGenre}
        onChange={props.onChangeNewGenre}
        onChangeRadioButton={props.onChangeRadioButton}
      />
      <ConventionalGenre
        canSelectGenre={canSelectGenre}
        genres={props.genres}
        convGenre={props.convGenre}
        isNewGenre={props.isNewGenre}
        onChangeConvGenre={props.onChangeConvGenre}
        onClickConvGenre={props.onClickConvGenre}
        onChangeRadioButton={props.onChangeRadioButton}
      />
    </div>
  );

  if (props.book.isInBookshelf) {
    return <></>;
  } else {
    return element;
  }
}

function Book(props) {
  const book = props.book;
  return (
    <>
      <p className="mt-4">本の情報</p>
      <BookCard book={book} />
    </>
  );
}

function Post(props) {
  return (
    <>
      <label htmlFor="message">
        <p className="mt-4">投稿メッセージ</p>
        <textarea
          name="message"
          id="message"
          cols="30"
          rows="10"
          onChange={props.onChange}
          value={props.message}
          required
        />
      </label>
      <button className="d-block" id="submit-button" onClick={props.onSubmit}>投稿する</button>
    </>
  );
}

export default class PostData extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      book: null,
      genres: null,
      isChecked: false,
      isNewGenre: true,
      message: '',
      newGenre: '',
      convGenre: '',
    };

    this.checkedAddToBookshelf = this.checkedAddToBookshelf.bind(this);
    this.getParams = this.getParams.bind(this);
    this.onClickConvGenre = this.onClickConvGenre.bind(this);
    this.onClickNewGenre = this.onClickNewGenre.bind(this);
    this.onChangeConvGenre = this.onChangeConvGenre.bind(this);
    this.onChangeNewGenre = this.onChangeNewGenre.bind(this);
    this.onChangeMessage = this.onChangeMessage.bind(this);
    this.onChangeRadioButton = this.onChangeRadioButton.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.redirectHome = this.redirectHome.bind(this);
    this.setBook = this.setBook.bind(this);
    this.setInitialConvGenre = this.setInitialConvGenre.bind(this);
    this.validation = this.validation.bind(this);
  }

  checkedAddToBookshelf() {
    const isChecked = !this.state.isChecked;
    this.setState({
      isChecked: isChecked,
      newGenre: '',
    });
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
    axios.get(path)
      .then(response => {
        this.setBook(response.data);
      })
      .catch(error => {
        console.log(error);
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

  onSubmit() {
    const book = this.state.book;
    const message = this.state.message;
    const path = '/api/book/post/' + book.isbn;

    const params = this.getParams();
    const errors = this.validation(params);

    if (errors.length) {
      console.log(errors);
    } else {
      axios.post(path, params)
        .then(response => {
          this.redirectHome();
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  redirectHome() {
    axios.get('/api/home')
      .then(response => {
        this.props.props.history.push('/home');
      })
      .catch(error => {
        console.log(error);
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

  validation(params) {
    const errors = [];

    if (params.message == "") {
      errors.push('Messege error!');
    }
    if (params.add_to_bookshelf
      && params.is_new_genre
      && params.new_genre == "") {
      errors.push('No Input Error in new Genre!');
    }

    return errors;
  }

  render() {
    let errors;
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
          <Subtitle subtitle="投稿画面" />
          {errors}
          <AddToBookshelf
            isChecked={isChecked}
            book={book}
            onChange={this.checkedAddToBookshelf}
          />
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
          <Post message={message} onChange={this.onChangeMessage} onSubmit={this.onSubmit} />
        </>
      );
    } else {
      return <h2 className="無効なリクエストです"></h2>;
    }
  }
}