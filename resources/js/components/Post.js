import React, { useContext, useEffect, useState } from 'react';
import Subtitle from './Subtitle';
import Errors from './Errors';
import { PropTypes } from 'prop-types';
import { PropsContext } from './Pages';
import { DataContext, SetStateContext } from './App';
import Genres from './Genres';
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
      <button className="d-block" id="submit-button" onClick={props.onSubmit}>
        投稿する
      </button>
    </>
  );
}

export default function PostData() {
  const props = useContext(PropsContext);

  const data = useContext(DataContext);
  const setState = useContext(SetStateContext);

  const [book, setBook] = useState(null);
  const [isChecked, setIsChecked] = useState(true);
  const [isNewGenre, setIsNewGenre] = useState(true);
  const [newGenre, setNewGenre] = useState('');
  const [errors, setErrors] = useState([]);
  const [convGenre, setConvGenre] = useState('');
  const [message, setMessage] = useState('');

  const genres = data.params.user.genres;

  useEffect(setup, []);

  function setup() {
    const isbn = props.match.params.isbn;
    const book = props.location.state;

    setInitialConvGenre();
    book ? setData(book) : getBookData();

    function getBookData() {
      //TODO: 本棚に追加済みの場合の処理
      axios
        .post('/api/book', {
          isbn: isbn,
        })
        .then((response) => {
          const book = response.data;
          setData(book);
        });
    }

    function setInitialConvGenre() {
      const keys = Object.keys(genres);
      const hasGenres = keys.length;

      if (hasGenres) {
        const iniValue = keys[0];

        setConvGenre(iniValue);
      }
    }
  }

  function setData(book) {
    const isChecked = !book.isInBookshelf;

    setBook(book);
    setIsChecked(isChecked);
  }

  function getParams() {
    const params = {
      isbn: book.isbn,
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      pubdate: book.pubdate,
      cover: book.cover,
      add_to_bookshelf: isChecked,
      is_new_genre: isNewGenre,
      new_genre: newGenre,
      genre_id: convGenre,
      message: message,
    };

    return params;
  }

  function onSubmit() {
    const path = '/api/book/post/' + book.isbn;

    const params = getParams();
    const errors = validation(params);

    if (errors.length) {
      setErrors(errors);
      // page上部へ
      window.scrollTo(0, 0);
    } else {
      axios
        .post(path, params)
        .then((response) => {
          linkToHome(response);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  function linkToHome(response) {
    // stateを更新する
    const params = response.data;

    setState.params(params);
    window.scrollTo(0, 0);
    props.history.push('/home');
  }

  function onClickConvGenre() {
    setIsNewGenre(false);
    setNewGenre('');
  }

  function onChangeRadioButton() {
    // 新しいジャンル->既存のジャンルへの切り替えだったらフォームを消去
    if (isNewGenre) {
      setNewGenre('');
    }

    setIsNewGenre(!isNewGenre);
  }

  function validation(params) {
    const errors = [];

    if (params.message == '') {
      errors.push('メッセージが入力されていません');
    }

    if (
      params.add_to_bookshelf &&
      params.is_new_genre &&
      params.new_genre == ''
    ) {
      errors.push('ジャンル名が入力されていません');
    }

    return errors;
  }

  if (book && genres) {
    return (
      <>
        <Subtitle subtitle="投稿画面" />
        <Errors errors={errors} />
        <AddToBookshelf
          isChecked={isChecked}
          book={book}
          onChange={() => setIsChecked(!isChecked)}
        />
        <Genres
          book={book}
          isChecked={isChecked}
          isNewGenre={isNewGenre}
          genres={genres}
          newGenre={newGenre}
          convGenre={convGenre}
          onChangeNewGenre={(e) => setNewGenre(e.target.value)}
          onClickNewGenre={() => setIsNewGenre(true)}
          onClickConvGenre={onClickConvGenre}
          onChangeConvGenre={(e) => setConvGenre(e.target.value)}
          onChangeRadioButton={onChangeRadioButton}
        />
        <p>本の情報</p>
        <BookCard book={book} />
        <Post
          message={message}
          onChange={(e) => setMessage(e.target.value)}
          onSubmit={onSubmit}
        />
      </>
    );
  } else {
    return <h2 className="無効なリクエストです"></h2>;
  }
}

AddToBookshelf.propTypes = {
  isChecked: PropTypes.bool,
  book: PropTypes.object,
  onChange: PropTypes.func,
};

Post.propTypes = {
  message: PropTypes.string,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
};
