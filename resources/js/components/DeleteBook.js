import { zipObjectDeep } from 'lodash';
import React from 'react';
import Subtitle from './Subtitle';
import UserCard from './UserCard';
import EditBookCard from './EditBookCard';

function Books(props) {
  const books = props.books.map((book) => {
    const label = 'book' + book.id;
    return (
      <label htmlFor={label} key={book.id}>
        <EditBookCard book={book}>
          <input type="checkbox" name={label} id={label} />
        </EditBookCard>
      </label>
    );
  });

  return books;
}

function EdittingBookshelf(props) {
  const genres_books = props.genres_books;
  const genres = props.genres;
  const Bookshelf = Object.keys(genres_books).map((genre_id) => {
    return (
      <div key={genre_id}>
        <p>{genres[genre_id]}</p>
        <Books books={genres_books[genre_id]} />
      </div>
    );
  });

  return Bookshelf;
}
export default class EditBook extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const params = this.props.params;
    return (
      <>
        <Subtitle subtitle="本の削除" />
        <UserCard user={params.user} />
        <EdittingBookshelf
          genres_books={params.genres_books}
          genres={params.genres}
        />
      </>
    );
  }
}
// @if ($books->isEmpty())
// <p class="text-danger mt-5">本が見つかりません</p>
// @else

// <div class="row book-shelf">
// <div class="col-12">
//     <form action="{{$url}}" method="POST">
//         @csrf
//         @foreach($genres_books as $genre_id => $books)
//             <label for="{{$genre_id}}">
//                 <input class="h2 mt-2 genres" name="{{$genre_id}}" value={{$genres[$genre_id]}} required>
//             </label>
//             @foreach($books->chunk(4) as $chunk)
//                 <div class="row mt-3">
//                     @foreach($chunk as $book)
//                         <?php $book_url = '/book/' . $book->isbn ?>
//                         <div class="col-3">
//                             <a href="{{$book_url}}">
//                                 @if (isset($book->cover))
//                                     <img class="img-fluid w-100" src="{{$book->cover}}" alt="book-cover">
//                                 @else
//                                     <img class="img-fluid w-100" src="{{asset('img/book.svg')}}" alt="book-cover">
//                                 @endif
//                             </a>
//                         </div>
//                     @endforeach
//                 </div>
//                 <div class="row mt-2">
//                     @foreach($chunk as $book)
//                     <div class="col-3">
//                         <p>{{$book->title}}</p>
//                     </div>
//                     @endforeach
//                 </div>
//             @endforeach
//         @endforeach
//         <button type="submit" class="btn btn-outline-success">ジャンルを編集する</button>
