import React, { useContext, useEffect, useState } from 'react';
import Subtitle from '../components/Subtitle';
import Errors from '../components/Errors';
import {
  MyButton,
  Caption,
  InputWithCheck,
  MyTextarea,
  NoImageCard,
} from '../components/Components';
import { PropTypes } from 'prop-types';
import { PropsContext } from '../components/MyRouter';
import { DataContext, SetStateContext } from './App';
import Genres from '../components/Genres';
import { BookCard } from '../components/BookCard';
import { MyLink } from '../functions/MyLink';

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
      <NoImageCard>
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
      </NoImageCard>
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
      <MyButton onClick={props.onSubmit} content="投稿する" withMargin={true} />
    </>
  );
}

export default function PostData() {
  const data = useContext(DataContext);
  const setState = useContext(SetStateContext);
  const props = useContext(PropsContext);

  // ログインしていない場合はページ遷移
  if (!data.params.user) {
    MyLink.home(props);
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
            MyLink.error(props);
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
      user_id: data.params.user.id,
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

  function linkToHome(response) {
    // stateを更新する
    const params = response.data;

    setState.params(params);
    MyLink.home(props);
    window.scrollTo(0, 0);
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
        <AddToBookshelf
          isChecked={isChecked}
          book={book}
          onChange={() => setIsChecked(!isChecked)}
        />
        <Genres
          errors={errors}
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
