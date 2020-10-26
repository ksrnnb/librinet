export default class Functions {
  /*
   *   @param ids [bookId, bookId, ...]
   *            will delete ids
   *
   *   @param books [book, book, ...]
   *           before delete
   *
   *   @return books [book, book, ...]
   *           deleted books
   */
  static unsetBooks(ids, books) {
    ids.forEach((id) => {
      if (Array.isArray(books)) {
        const index = books.findIndex((book) => {
          return book.id == id;
        });

        // みつからない場合の戻り値は-1
        const isFound = index !== -1;

        if (isFound) {
          books.splice(index, 1);
        }
        // 1冊の場合、booksはobject
      } else {
        const book = books;
        if (book.id == id) {
          return [];
        }
      }
    });

    return books;
  }

  /*
   *   @param ids [id, id, ...]
   *   @param orderedBooks {genreId: [book ,book, ....], genreId: [...]}
   *
   *   @return newGenreBooks (after deleted)
   */

  static unsetOrderedBooks(ids, orderedBooks) {
    const newOrderedBooks = new Object();
    Object.keys(orderedBooks).forEach((genreId) => {
      let books = orderedBooks[genreId];
      books = this.unsetBooks(ids, books);

      if (books.length) {
        newOrderedBooks[genreId] = books;
      }
    });

    // もし空のオブジェクトなら、空の配列を返す。
    // Laravelから送られるとき、データがない場合は空の配列なので合わせる。
    if (Object.keys(newOrderedBooks).length === 0) {
      return [];
    }

    return newOrderedBooks;
  }
}
