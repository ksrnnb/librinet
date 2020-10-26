import React, { useContext, useState } from 'react';
import Subtitle from '../components/Subtitle';
import UserCard from '../components/UserCard';
import { BookCard } from '../components/BookCard';
import { PropTypes } from 'prop-types';
import { PropsContext } from '../components/MainColumn';
import { DataContext, SetStateContext } from './App';
import { MyLink } from '../functions/MyLink';

const axios = window.axios;

function Books(props) {
  const deleteList = props.deleteList;

  function onClick(e) {
    // クリックすると、子要素、孫要素がevent.targetに入っているので、目的のdivまで上に遡る
    function getCard(node) {
      const parentNode = node.parentNode;
      if (parentNode.classList.contains('delete-book-card')) {
        return parentNode;
      } else {
        return getCard(parentNode);
      }
    }

    const id = Number(getCard(e.target).dataset.id);
    const hasId = deleteList.includes(id);
    let newList;

    if (hasId) {
      newList = deleteList.filter((value) => value !== id);
    } else {
      newList = deleteList.slice();
      newList.push(id);
    }

    props.setDeleteList(newList);
  }

  const books = props.books.map((book) => {
    const willDelete = deleteList.includes(book.id);
    return (
      <div
        className="delete-book-card mb-3"
        data-id={book.id}
        data-willdelete={willDelete}
        key={book.id}
        onClick={onClick}
      >
        <BookCard book={book} />
      </div>
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
        <h4 className="mt-5">{genres[genre_id]}</h4>
        <Books
          books={orderedBooks[genre_id]}
          deleteList={props.deleteList}
          setDeleteList={props.setDeleteList}
        />
      </div>
    );
  });

  return Bookshelf;
}

function DeleteButton(props) {
  return (
    <button
      className="btn btn-outline-danger d-block my-5"
      onClick={props.onClick}
    >
      削除する
    </button>
  );
}

export default function DeleteBook() {
  const props = useContext(PropsContext);
  const params = useContext(DataContext).params;
  const setState = useContext(SetStateContext);
  const [deleteList, setDeleteList] = useState([]);

  function redirectUserProfile() {
    const strId = props.match.params.strId;
    MyLink.userProfile(props, strId);
  }

  function onSubmitDelete() {
    const path = '/api/book';

    if (deleteList.length) {
      axios
        .delete(path, {
          data: { ids: deleteList },
        })
        .then((response) => {
          setState.params(response.data);
          redirectUserProfile();
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
      <h4 className="text-danger mt-5">削除したい本を選択してください</h4>
      <DeleteBooks
        orderedBooks={params.user.ordered_books}
        genres={params.user.genres}
        deleteList={deleteList}
        setDeleteList={setDeleteList}
      />
      <DeleteButton onClick={onSubmitDelete} />
    </>
  );
}

DeleteButton.propTypes = {
  onClick: PropTypes.func,
};
