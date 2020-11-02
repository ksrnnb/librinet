import React, { useContext, useState } from 'react';
import Subtitle from '../components/Subtitle';
import SearchedBook from '../components/SearchedBook';
import { SearchForm, Caption } from '../components/Components';
import { PropsContext } from '../components/MyRouter';

const axios = window.axios;

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
    <div className="mb-5">
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

export default function Book() {
  const [input, setInput] = useState(null);
  const [book, setBook] = useState(null);
  const [errors, setErrors] = useState(null);
  const props = useContext(PropsContext);

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
          const canUpdate = props.history.location.pathname === '/book';
          // 検索中にページ遷移していた場合はstate更新しない
          if (canUpdate) {
            const book = response.data;
            setBook(book);
            setErrors(null);
          }
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
    isbn = isbn.trim();
    isbn = isbn.match(/^9784[0-9]{9}$/);

    return isbn || false;
  }

  return (
    <div>
      <Subtitle subtitle="本の検索" />
      <Caption isTop={true} content="検索フォーム" />
      <SearchForm
        name="isbn"
        content="13桁のISBNを入力してください（9784...）"
        subMessage="（※一部本が見つからない場合や、表紙がない場合があります）"
        // maxLength={13}
        errors={errors}
        onChange={(e) => setInput(e.target.value)}
        onClick={sendPost}
      />
      {book && (
        <>
          <Caption content="検索結果" />
          <SearchedBook book={book} />
        </>
      )}
      <Example />
    </div>
  );
}
