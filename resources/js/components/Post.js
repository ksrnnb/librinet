import React from 'react';
import Subtitle from './Subtitle';
import Errors from './Errors';
import Redirect from './Redirect';
import GenreSelectFormat from './GenreSelectFormat';
import { PropTypes } from 'prop-types';

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

export default class PostData extends GenreSelectFormat {
  constructor(props) {
    super(props);

    this.checkedAddToBookshelf = this.checkedAddToBookshelf.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
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

  onSubmit() {
    const path = '/api/book/post/' + this.state.book.isbn;

    const params = this.getParams();
    const errors = this.validation(params);

    if (errors.length) {
      this.setState({
        errors: errors,
      });
      // page上部へ
      window.scrollTo(0, 0);
    } else {
      axios
        .post(path, params)
        .then(() => {
          Redirect.home.call(this);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  validation(params) {
    const errors = [];

    if (params.message == '') {
      errors.push('Messege error!');
    }
    if (
      params.add_to_bookshelf &&
      params.is_new_genre &&
      params.new_genre == ''
    ) {
      errors.push('No Input Error in new Genre!');
    }

    return errors;
  }

  render() {
    const book = this.state.book;
    const errors = this.state.errors;
    const message = this.state.message;
    const isChecked = this.state.isChecked;
    if (book) {
      return (
        <>
          <Subtitle subtitle="投稿画面" />
          <Errors errors={errors} />
          <AddToBookshelf
            isChecked={isChecked}
            book={book}
            onChange={this.checkedAddToBookshelf}
          />
          {super.render()}
          <Post
            message={message}
            onChange={this.onChangeMessage}
            onSubmit={this.onSubmit}
          />
        </>
      );
    } else {
      return <h2 className="無効なリクエストです"></h2>;
    }
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
