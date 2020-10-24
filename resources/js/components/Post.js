import React, { useContext, useEffect, useState } from 'react';
import Subtitle from './Subtitle';
import Errors from './Errors';
import {
  ButtonWithMargin,
  Caption,
  InputWithCheck,
  MyTextarea,
} from './Components';
import { PropTypes } from 'prop-types';
import { PropsContext } from './Pages';
import { DataContext, SetStateContext } from './App';
import Genres from './Genres';
import { BookCard } from './BookCard';

const axios = window.axios;

function AddToBookshelf(props) {
  const book = props.book;
  const isChecked = props.isChecked;

  let isDisabled, message, value;

  if (book.isInBookshelf) {
    isDisabled = true;
    message = <p className="mb-0">(本棚に追加済みです)</p>;
    value = '0';
  } else {
    isDisabled = false;
    message = null;
    value = '1';
  }

  return (
    <div className="mb-5">
      <Caption isTop={true} content="本棚への追加" />
      <InputWithCheck
        type="checkbox"
        name="add-book"
        value={value}
        checked={isChecked}
        disabled={isDisabled}
        onChange={props.onChange}
        content="本棚に追加して投稿する"
      />
      {message}
    </div>
  );
}

function Post(props) {
  return (
    <>
      <MyTextarea
        name="message"
        content="投稿メッセージ"
        onChange={props.onChange}
      />
      <ButtonWithMargin onClick={props.onSubmit} content="投稿する" />
    </>
  );
}

export default function PostData() {
  const data = useContext(DataContext);
  const setState = useContext(SetStateContext);
  const props = useContext(PropsContext);

  // ログインしていない場合はページ遷移
  if (!data.params.user) {
    props.history.push('/home');
    return <></>;
  }

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
      axios
        .post('/api/book', {
          isbn: isbn,
        })
        .then((response) => {
          const book = response.data;
          setData(book);
        })
        .catch((error) => {
          // ISBNが違う場合 404
          if (error.response.status === 404) {
            setErrors(['本がみつかりませんでした']);
            // validation error
          } else if (error.response.status == 422) {
            setErrors(['URLが正しくありません']);
          } else {
            props.history.push('/error');
          }
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
        <Caption content="本の情報" />
        <BookCard book={book} />
        <Post
          message={message}
          onChange={(e) => setMessage(e.target.value)}
          onSubmit={onSubmit}
        />
      </>
    );
  } else {
    return <Errors errors={errors} />;
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
