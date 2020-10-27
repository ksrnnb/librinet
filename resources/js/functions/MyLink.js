export class MyLink {
  static top(props) {
    window.scroll(0, 0);
    props.history.push('/');
  }

  static home(props) {
    window.scroll(0, 0);
    props.history.push('/home');
  }

  static login(props) {
    window.scroll(0, 0);
    props.history.push('/login');
  }

  static signup(props) {
    window.scroll(0, 0);
    props.history.push('/signup');
  }

  static userProfile(props, strId, user) {
    const path = '/user/profile/' + strId;
    window.scroll(0, 0);
    if (user) {
      props.history.push({
        pathname: path,
        state: {
          user: user,
        },
      });
    } else {
      props.history.push(path);
    }
  }

  static editUser(props, strId) {
    const path = '/user/edit/' + strId;
    window.scroll(0, 0);
    props.history.push(path);
  }

  static editGenre(props, strId) {
    const path = '/genre/edit/' + strId;
    window.scroll(0, 0);
    props.history.push(path);
  }

  static bookProfile(props, book) {
    const path = '/book/profile/' + book.isbn;
    props.history.push({
      pathname: path,
      state: book,
    });
  }

  static addBook(props, book) {
    const path = '/book/add/' + book.isbn;
    props.history.push({
      pathname: path,
      state: book,
    });
  }

  static deleteBook(props, strId) {
    const path = '/book/delete/' + strId;
    window.scroll(0, 0);
    props.history.push(path);
  }

  static post(props, book) {
    const path = '/book/post/' + book.isbn;
    window.scroll(0, 0);
    props.history.push({
      pathname: path,
      state: book,
    });
  }

  static comment(props, post) {
    const path = '/comment/' + post.uuid;
    window.scroll(0, 0);
    props.history.push({
      pathname: path,
      state: post,
    });
  }

  /**
   * @param {object} props
   * @param {object} user
   * @param {string} link (follows or followers)
   */
  static followers(props, user, link) {
    const path = '/user/profile/' + user.str_id + link;
    window.scroll(0, 0);
    props.history.push(path);
  }

  static error(props) {
    window.scroll(0, 0);
    props.history.push('/error');
  }
}
