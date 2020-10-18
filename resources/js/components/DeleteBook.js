import React, { useContext } from 'react';
import Subtitle from './Subtitle';
import UserCard from './UserCard';
import SelectBookCard from './SelectBookCard';
import Functions from './Functions';
import { PropTypes } from 'prop-types';
import { PropsContext } from './Pages';
import { DataContext, SetStateContext } from './App';

const axios = window.axios;

function Books(props) {
  const books = props.books.map((book) => {
    const label = 'book' + book.id;
    return (
      <label className="d-block" htmlFor={label} key={book.id}>
        <SelectBookCard book={book}>
          <input type="checkbox" name={label} id={label} data-id={book.id} />
        </SelectBookCard>
      </label>
    );
  });

  return books;
}

function DeleteBooks(props) {
  const orderedBooks = props.orderedBooks;
  const genres = props.genres;
  const Bookshelf = Object.keys(orderedBooks).map((genre_id) => {
    return (
      <div key={genre_id}>
        <h2 className="mt-5">{genres[genre_id]}</h2>
        <Books books={orderedBooks[genre_id]} />
      </div>
    );
  });

  return Bookshelf;
}

function DeleteButton(props) {
  return (
    <button className="btn btn-outline-danger d-block" onClick={props.onClick}>
      削除する
    </button>
  );
}

export default function DeleteBook() {
  const props = useContext(PropsContext);
  const params = useContext(DataContext).params;
  const setState = useContext(SetStateContext);

  function getIdsAndSubmit() {
    const inputs = [...document.getElementsByTagName('input')];

    const ids = [];
    inputs.forEach((input) => {
      const bookId = input.dataset.id;
      const willDelete = input.checked;

      if (willDelete) {
        ids.push(bookId);
      }
    });
    onSubmitDelete(ids);
  }

  function deleteBooks(ids) {
    const books = params.user.books;
    const deletedBooks = Functions.unsetBooks(ids, books);
    params.user.books = deletedBooks;
    setState.params(params);
  }

  function deleteOrderedBooks(ids) {
    const orderedBooks = params.user.ordered_books;
    const deletedOrderedBooks = Functions.unsetOrderedBooks(ids, orderedBooks);
    params.user.ordered_books = deletedOrderedBooks;
    setState.params(params);
  }

  function redirectUserProfile(ids) {
    deleteBooks(ids);
    deleteOrderedBooks(ids);
    const strId = props.match.params.strId;
    const path = '/user/profile/' + strId;

    props.history.push(path);
  }

  function onSubmitDelete(ids) {
    const path = '/api/book';

    if (ids.length) {
      axios
        .delete(path, {
          data: { ids: ids },
        })
        .then(() => {
          redirectUserProfile(ids);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      alert('本が選択されていません');
    }

  }

  return (
    <>
      <Subtitle subtitle="本の削除" />
      <UserCard user={params.user} />
      <DeleteBooks
        orderedBooks={params.user.ordered_books}
        genres={params.user.genres}
      />
      <DeleteButton onClick={getIdsAndSubmit} />
    </>
  );
}

DeleteButton.propTypes = {
  onClick: PropTypes.func,
};
