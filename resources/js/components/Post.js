import React from 'react';
import Subtitle from './Subtitle';
import BookCard from './BookCard';

const axios = window.axios;

function AddToBookshelf(props) {
  const book = props.book;
  const isChecked = props.isChecked;

  let style, value, isDisabled;

  if (book.isInBookshelf) {
    style = 'opacity:0.5';
    value = '0';
    isDisabled = true;
  } else {
    value = '1';
    isDisabled = false;

  }

  return (
    <label htmlFor="add-book" style={style}>
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

  );
}

function NewGenre(props) {
  const canSelectGenre = props.canSelectGenre;
  const newGenre = props.newGenre;
  let disabled = !canSelectGenre;

  const isNewGenre = props.isNewGenre;
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
          defaultChecked
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
          onChange={props.onChange}
        />
      </label>
    </>
  );
}

function ConventionalGenre(props) {

  const canSelectGenre = props.canSelectGenre;
  let disabled = !canSelectGenre;

  const isNewGenre = props.isNewGenre;
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
            disabled={disabled}
            onChange={props.onChangeRadioButton}
          />
            既存のジャンルから選択
       </label>
        <select name="genre_id" className="d-block" disabled={disabled} >
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

  return (
    <div className={divClass}>
      <NewGenre
        canSelectGenre={canSelectGenre}
        isNewGenre={props.isNewGenre}
        newGenre={newGenre}
        onChange={props.onChangeNewGenre}
        onChangeRadioButton={props.onChangeRadioButton}
      />
      <ConventionalGenre
        canSelectGenre={canSelectGenre}
        genres={props.genres}
        isNewGenre={props.isNewGenre}
        onChangeRadioButton={props.onChangeRadioButton}
      />
    </div>
  );
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
    };

    this.checkedAddToBookshelf = this.checkedAddToBookshelf.bind(this);
    this.onChangeNewGenre = this.onChangeNewGenre.bind(this);
    this.onChangeMessage = this.onChangeMessage.bind(this);
    this.onChangeRadioButton = this.onChangeRadioButton.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.setBook = this.setBook.bind(this);
  }

  checkedAddToBookshelf() {
    const isChecked = !this.state.isChecked;
    this.setState({
      isChecked: isChecked,
      newGenre: '',
    });
  }

  componentDidMount() {
    const params = this.props.props.location.state;

    if (params) {
      this.setBook(params);
    } else {
      const isbn = this.props.props.match.params.isbn;
      this.getBookData(isbn);
    }

  }

  getBookData(isbn) {
    const path = '/api/book/post/' + isbn;
    axios.get(path)
      .then(response => {
        this.setBook(response.data);
      })
      .catch(error => {
        console.log(error);
      })
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
    this.setState({
      isNewGenre: isNewGenre,
    });
  }

  onSubmit() {
    const path = '/api/book/post' + this.state.book.isbn;
    console.log(this.state.book);
    console.log(this.state.message);
    // axios.post(path, {

    // })
  }

  sendPost() {
    const path = this.props.props.location;
    axios.post(path, {
      title: title,
      author: author,
      cover: cover,
      publisher: publisher,
      pubdata: pubdate,
    });
  }

  setBook(params) {
    const isChecked = !params.book.isInBookshelf;

    this.setState({
      book: params.book,
      genres: params.genres,
      isChecked: isChecked,
    });
  }

  render() {
    let errors;
    const book = this.state.book;
    const genres = this.state.genres;
    const message = this.state.message;
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
            isChecked={isChecked}
            isNewGenre={isNewGenre}
            genres={genres}
            newGenre={newGenre}
            onChangeNewGenre={this.onChangeNewGenre}
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