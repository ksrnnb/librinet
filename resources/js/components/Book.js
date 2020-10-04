import React from 'react';
import Subtitle from './Subtitle';
import BookCard from './BookCard';
import Errors from './Errors';

const axios = window.axios;

function InputPrompt() {
  return (
    <>
      <h4 className="mt-3 mb-0">13桁のISBNを入力してください</h4>
      <p>（9784... ハイフン有りでもOK）</p>
    </>
  );
}

function ShowExamples() {
  const exampleBooks = new Map([
    [9784798060996, 'PHPフレームワーク Laravel入門 第2版'],
    [9784297100339, 'Docker/Kubernetes実践コンテナ開発入門'],
    [9784839955557, 'ノンデザイナーズ・デザインブック'],
  ]);

  const tableRows = [];
  exampleBooks.forEach((title, isbn) => {
    tableRows.push(
      <tr key={isbn}>
        <td>{isbn}</td>
        <td>{title}</td>
      </tr>
    );
  });

  return tableRows;
}

function Example() {
  return (
    <div>
      <h4 className="pl-3 mt-3">ISBN 例</h4>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">ISBN</th>
            <th scope="col">Title</th>
          </tr>
        </thead>
        <tbody>
          <ShowExamples />
        </tbody>
      </table>
    </div>
  );
}

function UserInput(props) {
  // 微妙に上下にpadding/marginがあるので省く
  return (
    <input
      className="mr-3 py-0"
      type="text"
      id="isbn"
      name="isbn"
      onChange={props.onChange}
      required
    />
  );
}

function Button(props) {
  return (
    <input
      type="button"
      className="btn btn-outline-success"
      onClick={props.onClick}
      id="search"
      value="検索"
    />
  );
}

export default class Book extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      input: null,
      book: null,
      isInBookshelf: null,
      errors: null,
    };

    this.linkToPost = this.linkToPost.bind(this);
    this.linkToAddBookshelf = this.linkToAddBookshelf.bind(this);
    this.onChangeInput = this.onChangeInput.bind(this);
    this.sendPost = this.sendPost.bind(this);
    this.setBook = this.setBook.bind(this);
    this.setError = this.setError.bind(this);
    this.validateInputAndReturnIsbn = this.validateInputAndReturnIsbn.bind(
      this
    );
  }

  postButton() {
    const book = this.state.book;
    const postButton = (
      <button
        type="button"
        className="btn btn-outline-success mr-3"
        onClick={() => {
          this.linkToPost(book);
        }}
      >
        本の投稿をする
      </button>
    );

    let addButton = null;
    const isInBookshelf = this.state.isInBookshelf;
    if (!isInBookshelf) {
      addButton = (
        <button
          type="button"
          className="btn btn-outline-success"
          onClick={() => {
            this.linkToAddBookshelf(book);
          }}
        >
          本棚に追加する
        </button>
      );
    }

    return (
      <>
        {postButton}
        {addButton}
      </>
    );
  }

  linkToPost(book) {
    const postUrl = '/book/post/' + book.isbn;
    this.props.props.history.push(postUrl);
  }

  linkToAddBookshelf(book) {
    const addUrl = '/book/add/' + book.isbn;
    this.props.props.history.push(addUrl);
  }

  onChangeInput(e) {
    this.setState({
      input: e.target.value,
    });
  }

  // TODO エンターを押しても送信できるようにしたい
  // pressEnter(e) {
  //     const keyCode = e.charCode;
  //     console.log(e);

  //     if (keyCode == 13) {
  //         console.log('Enter!?');
  //         this.sendPost();
  //     }
  // }

  setBook(params) {
    this.setState({
      book: params.book,
      isInBookshelf: params.isInBookshelf,
      errors: null,
    });
  }

  setError(error) {
    const errors = [];

    if (error == 'InputError') {
      errors.push('ISBNが正しく入力されていません');
    } else if (error == 'NotFound') {
      errors.push('本が見つかりませんでした');
    } else {
      errors.push('予期しないエラーが発生しました');
    }

    this.setState({
      errors: errors,
    });
  }

  sendPost() {
    const input = this.state.input;
    const isbn = this.validateInputAndReturnIsbn(input);

    if (isbn) {
      axios
        .post('/api/book', {
          isbn: input,
        })
        .then((response) => {
          this.setBook(response.data);
        })
        .catch((error) => {
          // 本が見つからない場合は404に設定した (BookController)
          if (error.response.status == 404) {
            this.setError('NotFound');
          } else {
            // サーバー側のvalidationに引っ掛かった場合など。
            // JavaScript側のvalidationで十分だと思うけど一応。
            this.setError('UnknownError');
          }
        });
    } else {
      this.setError('InputError');
    }
  }

  validateInputAndReturnIsbn(input) {
    if (input == null) return false;

    let isbn = input.replace(/-/g, '');
    isbn = isbn.match(/^9784[0-9]{9}$/);
    if (isbn != null) {
      return isbn;
    } else {
      return false;
    }
  }

  render() {
    const book = this.state.book;
    const hasSearchedBook = book != null;
    let bookElement = null;
    if (hasSearchedBook) {
      bookElement = (
        <div className="row mt-5 book">
          <BookCard book={book}>{this.postButton()}</BookCard>
        </div>
      );
    }

    const errors = this.state.errors;

    return (
      <div>
        <Subtitle subtitle="本の検索" />
        <label htmlFor="isbn">
          <InputPrompt />
          <Errors errors={errors} />
          <UserInput onChange={this.onChangeInput} />
          <Button onClick={this.sendPost} />
        </label>
        <Example />
        {bookElement}
      </div>
    );
  }
}
