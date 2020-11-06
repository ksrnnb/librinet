import React, { useContext, useEffect, useState } from 'react';
import Subtitle from '../components/Subtitle';
import Errors from '../components/Errors';
import Genres from '../components/Genres';
import { MyButton, Caption } from '../components/Components';
import { BookCard } from '../components/BookCard';
import { PropsContext } from '../components/MyRouter';
import { DataContext, SetStateContext } from './App';
import { MyLink } from '../functions/MyLink';
import { Book, Response, Error, Data } from '../types/Interfaces';
const axios = window.axios;

export default function AddBook() {
  const data: Data = useContext(DataContext);
  const setState: any = useContext(SetStateContext);
  const props: any = useContext(PropsContext);

  // ログインしていない場合はページ遷移
  if (!data.params.user) {
    MyLink.home(props);
    return <></>;
  }

  const [errors, setErrors]: any = useState([]);
  const [book, setBook]: any = useState(null);
  const [isChecked, setIsChecked]: any = useState(true);
  const [isNewGenre, setIsNewGenre]: any = useState(true);
  const [newGenre, setNewGenre]: any = useState('');
  const [convGenre, setConvGenre]: any = useState('');

  const genres = data.params.user.genres;

  useEffect(setup, []);

  function setup() {
    const isbn: string = props.match.params.isbn;
    const book: Book = props.location.state;

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

    function setData(book: Book) {
      if (book.isInBookshelf) {
        setErrors(['既に本棚に追加済みです']);
        return;
      }

      const isChecked = !book.isInBookshelf;
      setBook(book);
      setIsChecked(isChecked);
    }

    function getBookData() {
      axios
        .post('/api/book', {
          isbn: isbn,
        })
        .then((response: Response) => {
          const hasBook = response.data.isInBookshelf;
          if (hasBook) {
            setErrors(['既に本棚に追加済みです']);
          } else {
            const book = response.data;
            setData(book);
          }
        })
        .catch((error: Error) => {
          // ISBNが違う場合 404
          if (error.response.status === 404) {
            setErrors(['本がみつかりませんでした']);
            // validation error
          } else if (error.response.status == 422) {
            setErrors(['URLが正しくありません']);
          } else {
            MyLink.error(props);
          }
        });
    }
  }

  function getParams() {
    const params = {
      user_id: data.params.user.id,
      isInBookshelf: true,
      isbn: book.isbn,
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      pubdate: book.pubdate,
      cover: book.cover,
      is_new_genre: isNewGenre,
      new_genre: newGenre,
      genre_id: convGenre,
    };

    return params;
  }

  function submitBook() {
    const path = '/api/book/add';

    const params: any = getParams();
    const errors: string[] = validation(params);

    if (errors.length) {
      setErrors(errors);
      // page上部へ
      window.scrollTo(0, 0);
    } else {
      axios
        .post(path, params)
        .then((response: Response) => {
          linkToUserPage(response);
        })
        .catch((error: Error) => {
          if (error.response.status == 422) {
            const errors = Object.values(error.response.data.errors);
            setErrors(errors);
            window.scroll(0, 0);
          } else {
            alert('予期しないエラーが発生しました');
          }
        });
    }
  }

  function linkToUserPage(response: Response) {
    // stateを更新する
    const params = data.params;
    params.user.books = response.data.books;
    params.user.genres = response.data.genres;
    params.user.ordered_books = response.data.ordered_books;

    setState.params(params);
    MyLink.userProfile(props, params.user.str_id);
  }

  function validation(params: any) {
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
        <Genres
          book={book}
          errors={errors}
          isChecked={isChecked}
          isNewGenre={isNewGenre}
          genres={genres}
          newGenre={newGenre}
          convGenre={convGenre}
          onChangeNewGenre={(e: any) => setNewGenre(e.target.value)}
          onClickNewGenre={() => setIsNewGenre(true)}
          onClickConvGenre={onClickConvGenre}
          onChangeConvGenre={(e: any) => setConvGenre(e.target.value)}
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
