import React from 'react';
import Subtitle from './Subtitle';
import UserCard from './UserCard';
import SelectBookCard from './SelectBookCard';
import Functions from './Functions';

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
  const genres_books = props.genres_books;
  const genres = props.genres;
  const Bookshelf = Object.keys(genres_books).map((genre_id) => {
    return (
      <div key={genre_id}>
        <h2 className="mt-5">{genres[genre_id]}</h2>
        <Books books={genres_books[genre_id]} />
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

export default class DeleteBook extends React.Component {
  constructor(props) {
    super(props);

    this.deleteBooks = this.deleteBooks.bind(this);
    this.deleteGenresBooks = this.deleteGenresBooks.bind(this);
    this.getIdsAndSubmit = this.getIdsAndSubmit.bind(this);
    this.onSubmitDelete = this.onSubmitDelete.bind(this);
    this.redirectUserProfile = this.redirectUserProfile.bind(this);
  }

  getIdsAndSubmit() {
    const inputs = [...document.getElementsByTagName('input')];

    const ids = [];
    inputs.forEach((input) => {
      const bookId = input.dataset.id;
      const willDelete = input.checked;

      if (willDelete) {
        ids.push(bookId);
      }
    });
    this.onSubmitDelete(ids);
  }

  deleteBooks(ids) {
    const books = this.props.params.books;
    const deletedBooks = Functions.unsetBooks(ids, books);
    this.props.setStateBooks(deletedBooks);
  }

  deleteGenresBooks(ids) {
    const genresBooks = this.props.params.genres_books;
    const deletedGenresBooks = Functions.unsetGenresBooks(ids, genresBooks);
    this.props.setStateGenresBooks(deletedGenresBooks);
  }

  redirectUserProfile(ids) {
    this.deleteBooks(ids);
    this.deleteGenresBooks(ids);
    const props = this.props.props;
    const strId = props.match.params.strId;
    const path = '/user/profile/' + strId;

    props.history.push(path);
  }

  onSubmitDelete(ids) {
    const path = '/api/book';
    this.redirectUserProfile(ids);

    // axios
    //   .delete(path, {
    //     data: { ids: ids },
    //   })
    //   .then((response) => {
    //     this.redirectUserProfile(ids);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }

  render() {
    const params = this.props.params;
    return (
      <>
        <Subtitle subtitle="本の削除" />
        <UserCard user={params.user} />
        <DeleteBooks
          genres_books={params.genres_books}
          genres={params.genres}
        />
        <DeleteButton onClick={this.getIdsAndSubmit} />
      </>
    );
  }
}
