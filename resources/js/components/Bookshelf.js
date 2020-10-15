import React, { useContext } from 'react';
import BooksElement from './BooksElement';
import { PropTypes } from 'prop-types';
import { PropsContext } from './Pages';

function Message(props) {
  const pages_props = useContext(PropsContext);
  const isSelf = props.user.str_id === pages_props.match.params.strId;

  if (isSelf) {
    return (
      <>
        <p>本棚に本を追加しましょう！</p>
        <a href="/book">
          <button type="button" className="btn btn-outline-success">
            本を探す
          </button>
        </a>
      </>
    );
  } else {
    return <></>;
  }
}

function NoBook(props) {
  const hasNoBook = props.ordered_books.length === 0;

  if (hasNoBook) {
    return (
      <div className="row" key="nobook">
        <div className="col-12">
          <p className="text-danger">本棚に本がありません</p>
          <Message user={props.user} />
        </div>
      </div>
    );
  } else {
    return <></>;
  }
}

function Books(props) {
  const genres = props.genres;
  const ordered_books = props.ordered_books;

  const books = Object.keys(ordered_books).map((genreId) => {
    let genre;
    const books = ordered_books[genreId];
    const willEdit = props.willEdit;

    if (willEdit) {
      genre = (
        <input
          className="mb-5"
          defaultValue={genres[genreId]}
          data-id={genreId}
        />
      );
    } else {
      genre = (
        <h2 className="mt-5" data-id={genreId}>
          {genres[genreId]}
        </h2>
      );
    }

    return (
      <div className="row" key={genreId}>
        <div className="col-12">{genre}</div>
        <BooksElement books={books} />
      </div>
    );
  });

  return books;
}

export default function Bookshelf(props) {
  const genres = props.genres;
  const ordered_books = props.ordered_books;
  const willEdit = props.willEdit ? props.willEdit : false;

  return (
    <>
      <h2 className="mt-5 mb-0" key="bookshelf">
        本棚
      </h2>
      <NoBook user={props.user} ordered_books={ordered_books} />
      <Books
        genres={genres}
        ordered_books={ordered_books}
        willEdit={willEdit}
      />
    </>
  );
}

Bookshelf.propTypes = {
  genres: PropTypes.object,
  ordered_books: PropTypes.object,
  willEdit: PropTypes.bool,
  user: PropTypes.object,
};
