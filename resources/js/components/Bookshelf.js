import React from 'react';
import BooksElement from './BooksElement';

function Message(props) {
  const isSelf = props.user.str_id === props.props.match.params.strId;

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
  const hasNoBook = props.genres_books.length === 0;

  if (hasNoBook) {
    return (
      <div className="row" key="nobook">
        <div className="col-12">
          <p className="text-danger">本棚に本がありません</p>
          <Message user={props.user} props={props.props} />
        </div>
      </div>
    );
  } else {
    return <></>;
  }
}

function Books(props) {
  const genres = props.genres;
  const genres_books = props.genres_books;

  const books = Object.keys(genres_books).map((genreId) => {
    let genre;
    const books = genres_books[genreId];
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
  const genres_books = props.genres_books;

  return (
    <>
      <h2 className="mt-5 mb-0" key="bookshelf">
        本棚
      </h2>
      <NoBook
        user={props.user}
        props={props.props}
        genres_books={genres_books}
      />
      <Books genres={genres} genres_books={genres_books} />
    </>
  );
}