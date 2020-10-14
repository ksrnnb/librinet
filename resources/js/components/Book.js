import React, { useState } from 'react';
import Subtitle from './Subtitle';
import Errors from './Errors';
import SearchedBook from './SearchedBook';

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

export default function Book() {
  const [input, setInput] = useState(null);
  const [book, setBook] = useState(null);
  const [isInBookshelf, setIsInBookshelf] = useState(null);
  const [errors, setErrors] = useState(null);

  // TODO エンターを押しても送信できるようにしたい
  // pressEnter(e) {
  //     const keyCode = e.charCode;
  //     console.log(e);

  //     if (keyCode == 13) {
  //         console.log('Enter!?');
  //         this.sendPost();
  //     }
  // }

  function sendPost() {
    const isbn = validateInputAndReturnIsbn(input);

    if (isbn) {
      axios
        .post('/api/book', {
          isbn: input,
        })
        .then((response) => {
          const params = response.data;
          setBook(params.book);
          setIsInBookshelf(params.isInBookshelf);
          setErrors(null);
        })
        .catch((error) => {
          // 本が見つからない場合は404に設定した (BookController)
          if (error.response.status == 404) {
            setErrors('NotFound');
          } else {
            // サーバー側のvalidationに引っ掛かった場合など。
            // JavaScript側のvalidationで十分だと思うけど一応。
            setErrors('UnknownError');
          }
        });
    } else {
      setErrors('InputError');
    }
  }

  function validateInputAndReturnIsbn(input) {
    if (input == null) return false;

    let isbn = input.replace(/-/g, '');
    isbn = isbn.match(/^9784[0-9]{9}$/);
    if (isbn != null) {
      return isbn;
    } else {
      return false;
    }
  }

  return (
    <div>
      <Subtitle subtitle="本の検索" />
      <label htmlFor="isbn">
        <InputPrompt />
        <Errors errors={errors} />
        <UserInput onChange={(e) => setInput(e.target.value)} />
        <Button onClick={sendPost} />
      </label>
      {book && <SearchedBook book={book} isInBookshelf={isInBookshelf} />}
      <Example />
    </div>
  );
}
