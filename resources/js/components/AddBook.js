import React, { useContext, useEffect, useState } from 'react';
import Subtitle from './Subtitle';
import Errors from './Errors';
import Genres from './Genres';
import { MyButton, Caption } from './Components';
import { BookCard } from './BookCard';
import { PropsContext } from './Pages';
import { DataContext, SetStateContext } from './App';
const axios = window.axios;

export default function AddBook() {
  const data = useContext(DataContext);
  const setState = useContext(SetStateContext);
  const props = useContext(PropsContext);

  // ログインしていない場合はページ遷移
  if (!data.params.user) {
    props.history.push('/home');
    return <></>;
  }

  const [errors, setErrors] = useState([]);
  const [book, setBook] = useState(null);
  const [isChecked, setIsChecked] = useState(true);
  const [isNewGenre, setIsNewGenre] = useState(true);
  const [newGenre, setNewGenre] = useState('');
  const [convGenre, setConvGenre] = useState('');

  const genres = data.params.user.genres;

  useEffect(setup, []);

  function setup() {
    const isbn = props.match.params.isbn;
    const book = props.location.state;

    setInitialConvGenre();

    book ? setData(book) : getBookData();

    function setInitialConvGenre() {
      const keys = Object.keys(genres);
      const hasGenres = keys.length;

      if (hasGenres) {
        const iniValue = keys[0];

        setConvGenre(iniValue);
      }
    }

    function setData(book) {
      const isChecked = !book.isInBookshelf;

      setBook(book);
      setIsChecked(isChecked);
    }

    function getBookData() {
      axios
        .post('/api/book', {
          isbn: isbn,
        })
        .then((response) => {
          const hasBook = response.data.isInBookshelf;
          if (hasBook) {
            setErrors(['既に本棚に追加済みです']);
          } else {
            const book = response.data;
            setData(book);
          }
        })
        .catch((error) => {
          // ISBNが違う場合 404
          if (error.response.status === 404) {
            alert('本が見つかりません');
            // 既に追加済みの場合など
          } else {
            props.history.push('/error');
          }
        });
    }
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
    };

    return params;
  }

  function submitBook() {
    const path = '/api/book/add';

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
          linkToUserPage(response);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  function linkToUserPage(response) {
    // stateを更新する
    const params = data.params;
    params.user.books = response.data.books;
    params.user.genres = response.data.genres;
    params.user.ordered_books = response.data.ordered_books;

    setState.params(params);

    const path = '/user/profile/' + params.user.str_id;
    props.history.push(path);
  }

  function validation(params) {
    const errors = [];

    if (params.is_new_genre && params.new_genre == '') {
      errors.push('ジャンル名が入力されていません');
    }

    return errors;
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

  if (book && genres) {
    return (
      <>
        <Subtitle subtitle="本棚に追加" />
        <Errors errors={errors} />
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
        <MyButton
          onClick={submitBook}
          content="本棚に追加する"
          withMargin={true}
        />
      </>
    );
  } else {
    return (
      <>
        <Subtitle subtitle="本棚に追加" />
        <Errors errors={errors} />
      </>
    );
  }
}
