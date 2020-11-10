import React, { useContext } from 'react';
import BooksElement from './BooksElement';
import { GearIcon } from './Icon';
import { PropsContext } from './MyRouter';
import { NoImageCard, Caption } from './Components';
import { Book as BookInterface, User } from '../types/Interfaces';

function Message(props: { user: User }) {
  const routerProps = useContext(PropsContext);
  const isSelf = props.user.str_id === routerProps.match.params.strId;

  if (isSelf) {
    return (
      <>
        <p>本棚に本を追加しましょう！</p>
        <button
          type="button"
          className="btn btn-outline-success"
          onClick={() => routerProps.history.push('/book')}
        >
          本を探す
        </button>
      </>
    );
  } else {
    return <></>;
  }
}

function NoBook(props: any) {
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

function Books(props: any): any {
  const genres = props.genres;
  const orderedBooks = props.orderedBooks;
  const iterator = Object.keys(orderedBooks);
  const dropdownMenu = props.dropdownMenu;

  const books = iterator.map((genreId) => {
    let genre;
    const books = orderedBooks[genreId];
    const willEdit = props.willEdit;
    const isFirstLoop = iterator.indexOf(genreId) === 0;
    const margin = isFirstLoop ? '' : 'mt-3';

    if (willEdit) {
      genre = (
        <input
          className={`${margin} mb-3 genre`}
          name="genre"
          maxLength={16}
          defaultValue={genres[genreId]}
          data-id={genreId}
        />
      );
    } else {
      genre = (
        <div className="genre-name-wrapper">
          <h4
            className={`${margin} genre-name font-weight-bold`}
            data-id={genreId}
          >
            {genres[genreId]}
          </h4>
          <h4 className={`${margin} gear-icon-wrapper`}>
            {isFirstLoop && dropdownMenu && (
              <GearIcon dropdownMenu={dropdownMenu} />
            )}
          </h4>
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

export default function Bookshelf(props: any) {
  const genres = props.genres;
  const orderedBooks = props.orderedBooks;
  const dropdownMenu = props.dropdownMenu;
  const willEdit = props.willEdit ? props.willEdit : false;

  return (
    <>
      <Caption content="本棚" />
      <NoImageCard>
        <NoBook user={props.user} orderedBooks={orderedBooks} />
        <Books
          genres={genres}
          orderedBooks={orderedBooks}
          willEdit={willEdit}
          dropdownMenu={dropdownMenu}
        />
      </NoImageCard>
    </>
  );
}
