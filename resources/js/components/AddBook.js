import React, { useContext, useEffect, useState } from 'react';
import Subtitle from './Subtitle';
import Errors from './Errors';
import Genres from './Genres';
import BookCard from './BookCard';
import { PropsContext } from './Pages';
import { DataContext, SetStateContext } from './App';
const axios = window.axios;

export default function AddBook() {
  const [errors, setErrors] = useState([]);
  const [book, setBook] = useState(null);
  const [genres, setGenres] = useState(null);
  const [isChecked, setIsChecked] = useState(true);
  const [isNewGenre, setIsNewGenre] = useState(true);
  const [newGenre, setNewGenre] = useState('');
  const [convGenre, setConvGenre] = useState('');

  const props = useContext(PropsContext);
  const data = useContext(DataContext);
  const setState = useContext(SetStateContext);

  useEffect(() => {
    const isbn = props.match.params.isbn;
    getBookData(isbn);
  }, []);

  function getBookData(isbn) {
    //TODO: 本棚に追加済みの場合の処理
    const path = '/api/book/post/' + isbn;
    axios
      .get(path)
      .then((response) => {
        setData(response.data);
      })
      .catch(() => {
        props.history.push('/login');
      });
  }

  function setData(params) {
    const isChecked = !params.book.isInBookshelf;

    setBook(params.book);
    setGenres(params.genres);
    setIsChecked(isChecked);
    setInitialConvGenre(params.genres);
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
      errors.push('No Input Error in new Genre!');
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

  function setInitialConvGenre(genres) {
    const keys = Object.keys(genres);
    const hasGenres = keys.length;

    if (hasGenres) {
      const iniValue = keys[0];

      setConvGenre(iniValue);
    }
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
        <BookCard book={book} />
        <button className="btn btn-outline-success" onClick={submitBook}>
          本棚に追加する
        </button>
      </>
    );
  } else {
    return <h2 className="無効なリクエストです"></h2>;
  }
}
