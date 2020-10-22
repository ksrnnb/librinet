import React, { useState } from 'react';
import Subtitle from './Subtitle';
import Errors from './Errors';
import SearchedBook from './SearchedBook';
import PropTypes from 'prop-types';

const axios = window.axios;

function InputPrompt() {
  return (
    <>
      <h4 className="mb-0">13桁のISBNを入力してください</h4>
      <p>（※国内の本に限ります。9784...）</p>
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
        <td scope="row">{isbn}</td>
        <td>{title}</td>
      </tr>
    );
  });

  return tableRows;
}

function Example() {
  return (
    <div>
      <h4 className="mt-5">ISBN 例</h4>
      <table className="table shadow">
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
          const book = response.data;
          setBook(book);
          setErrors(null);
        })
        .catch((error) => {
          if (error.response.status == 404) {
            setErrors(['本が見つかりませんでした']);
          } else {
            // サーバー側のvalidationに引っ掛かった場合など。
            setErrors(['Unknown Error']);
          }
        });
    } else {
      setErrors(['ISBNが正しく入力されていません']);
    }
  }

  function validateInputAndReturnIsbn(input) {
    if (input == null) return false;

    // -の削除とスペースの削除
    let isbn = input.replace(/-/g, '');
    isbn = isbn.replace(/[\x20\u3000]/g, '');
    isbn = isbn.match(/^9784[0-9]{9}$/);

    return isbn || false;
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
      {book && <SearchedBook book={book} />}
      <Example />
    </div>
  );
}

// === validation ===
UserInput.propTypes = {
  onChange: PropTypes.func,
};

Button.propTypes = {
  onClick: PropTypes.func,
};
