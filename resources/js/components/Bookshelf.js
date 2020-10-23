import React, { useContext } from 'react';
import BooksElement from './BooksElement';
import { GearIcon } from './Icon';
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
  const hasNoBook = props.orderedBooks.length === 0;

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
  const orderedBooks = props.orderedBooks;
  const iterator = Object.keys(orderedBooks);
  const dropdownMenu = props.dropdownMenu;

  const books = iterator.map((genreId) => {
    let genre;
    const books = orderedBooks[genreId];
    const willEdit = props.willEdit;
    const isFirstLoop = iterator.indexOf(genreId) === 0;

    if (willEdit) {
      genre = (
        <input
          className="mb-3 genres"
          defaultValue={genres[genreId]}
          data-id={genreId}
        />
      );
    } else {
      genre = (
        <div className="genre-name-wrapper">
          <h3 className="mt-3 genre-name" data-id={genreId}>
            {genres[genreId]}
          </h3>
          <h3 className="mt-3 gear-icon-wrapper">
            {isFirstLoop && dropdownMenu && (
              <GearIcon dropdownMenu={dropdownMenu} />
            )}
          </h3>
        </div>
      );
    }

    return (
      <div className="row genre" key={genreId}>
        <div className="col-12">{genre}</div>
        <BooksElement books={books} />
      </div>
    );
  });

  return books;
}

export default function Bookshelf(props) {
  const genres = props.genres;
  const orderedBooks = props.orderedBooks;
  const dropdownMenu = props.dropdownMenu;
  const willEdit = props.willEdit ? props.willEdit : false;

  return (
    <>
      <h3 className="mt-5 mb-0" key="bookshelf">
        本棚
      </h3>
      <NoBook user={props.user} orderedBooks={orderedBooks} />
      <Books
        genres={genres}
        orderedBooks={orderedBooks}
        willEdit={willEdit}
        dropdownMenu={dropdownMenu}
      />
    </>
  );
}

Bookshelf.propTypes = {
  genres: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array, // 本が空の場合はarray
  ]),
  orderedBooks: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  willEdit: PropTypes.bool,
  user: PropTypes.object,
  dropdownMenu: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool, // 無いときはfalseが入ってる
  ]),
};
