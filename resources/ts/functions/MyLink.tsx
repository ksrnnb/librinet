export class MyLink {
  static top(props: any) {
    window.scroll(0, 0);
    props.history.push('/');
  }

  static home(props: any) {
    window.scroll(0, 0);
    props.history.push('/home');
  }

  static login(props: any) {
    window.scroll(0, 0);
    props.history.push('/login');
  }

  static signup(props: any) {
    window.scroll(0, 0);
    props.history.push('/signup');
  }

  static userProfile(props: any, strId: string, user: any) {
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

  static editUser(props: any, strId: string) {
    const path = '/user/edit/' + strId;
    window.scroll(0, 0);
    props.history.push(path);
  }

  static editGenre(props: any, strId: string) {
    const path = '/genre/edit/' + strId;
    window.scroll(0, 0);
    props.history.push(path);
  }

  static bookProfile(props: any, book: any) {
    const path = '/book/profile/' + book.isbn;
    props.history.push({
      pathname: path,
      state: book,
    });
  }

  static addBook(props: any, book: any) {
    const path = '/book/add/' + book.isbn;
    props.history.push({
      pathname: path,
      state: book,
    });
  }

  static deleteBook(props: any, strId: string) {
    const path = '/book/delete/' + strId;
    window.scroll(0, 0);
    props.history.push(path);
  }

  static post(props: any, book: any) {
    const path = '/book/post/' + book.isbn;
    window.scroll(0, 0);
    props.history.push({
      pathname: path,
      state: book,
    });
  }

  static comment(props: any, post: any) {
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
  static followers(props: any, user: any, link: string) {
    const path = '/user/profile/' + user.str_id + link;
    window.scroll(0, 0);
    props.history.push(path);
  }

  static error(props: any) {
    window.scroll(0, 0);
    props.history.push('/error');
  }
}
