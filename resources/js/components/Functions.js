const axios = window.axios;

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
      const index = books.findIndex((book) => {
        return book.id == id;
      });

      // みつからない場合の戻り値は-1
      const isFound = index !== -1;

      if (isFound) {
        books.splice(index, 1);
      }
    });

    return books;
  }

  /*
   *   @param ids [id, id, ...]
   *   @param genresBooks {genreId: [book ,book, ....], genreId: [...]}
   *
   *   @return newGenreBooks (after deleted)
   */
  static unsetGenresBooks(ids, genresBooks) {
    const newGenresBooks = new Object();

    Object.keys(genresBooks).forEach((genreId) => {
      let books = genresBooks[genreId];
      books = this.unsetBooks(ids, books);

      if (books.length) {
        newGenresBooks[genreId] = books;
      }
    });

    return newGenresBooks;
  }

  redirectHome() {
    this.props.props.history.push('/path');
  }

  redirectToUserProfile(strId) {
    const path = '/user/profile/' + strId;
    this.props.props.history.push(path);
  }

  redirectToEditGenre(strId) {
    const path = '/genre/edit/' + strId;
    this.props.props.history.push(path);
  }

  redirectToDeleteBook(strId) {
    const path = '/book/delete/' + strId;
    this.props.props.history.push(path);
  }
}
