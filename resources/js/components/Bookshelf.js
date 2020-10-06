import React from 'react';
import BooksElement from './BooksElement';

export default function Bookshelf(props) {
  const genres = props.genres;
  const genres_books = props.genres_books;
  const bookshelfElement = [
    <h2 className="mt-5 mb-0" key="bookshelf">
      本棚
    </h2>,
  ];

  const willEdit = props.willEdit;

  // TODO 本がない場合を確認。null?
  if (genres_books == null) {
    bookshelfElement.push(
      <div className="row" key="nobook">
        <div className="col-12">
          <p className="text-danger">本棚に本がありません</p>
          {/* TODO: ここは自分にしか見えないように */}
          <p>本棚に本を追加しましょう！</p>
          <a href="/book">
            <button type="button" className="btn btn-outline-success">
              本を探す
            </button>
          </a>
        </div>
      </div>
    );
  } else {
    bookshelfElement.push(
      Object.keys(genres_books).map((genreId) => {
        const books = genres_books[genreId];

        let genre;
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
      })
    );
  }

  return bookshelfElement;
}
