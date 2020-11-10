import { Book, Post } from '../types/Interfaces';
import { RouterProps, User } from '../types/Interfaces';

export class MyLink {
  static top(props: RouterProps) {
    window.scroll(0, 0);
    props.history.push('/');
  }

  static home(props: RouterProps) {
    window.scroll(0, 0);
    props.history.push('/home');
  }

  static login(props: RouterProps) {
    window.scroll(0, 0);
    props.history.push('/login');
  }

  static signup(props: RouterProps) {
    window.scroll(0, 0);
    props.history.push('/signup');
  }

  static userProfile(props: RouterProps, strId: string, user?: User) {
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

  static editUser(props: RouterProps, strId: string) {
    const path = '/user/edit/' + strId;
    window.scroll(0, 0);
    props.history.push(path);
  }

  static editGenre(props: RouterProps, strId: string) {
    const path = '/genre/edit/' + strId;
    window.scroll(0, 0);
    props.history.push(path);
  }

  static bookProfile(props: RouterProps, book: Book) {
    const path = '/book/profile/' + book.isbn;
    props.history.push({
      pathname: path,
      state: book,
    });
  }

  static addBook(props: RouterProps, book: Book) {
    const path = '/book/add/' + book.isbn;
    props.history.push({
      pathname: path,
      state: book,
    });
  }

  static deleteBook(props: RouterProps, strId: string) {
    const path = '/book/delete/' + strId;
    window.scroll(0, 0);
    props.history.push(path);
  }

  static post(props: RouterProps, book: Book) {
    const path = '/book/post/' + book.isbn;
    window.scroll(0, 0);
    props.history.push({
      pathname: path,
      state: book,
    });
  }

  static comment(props: RouterProps, post: Post) {
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
  static followers(props: RouterProps, user: User, link: string) {
    const path = '/user/profile/' + user.str_id + link;
    window.scroll(0, 0);
    props.history.push(path);
  }

  static error(props: RouterProps) {
    window.scroll(0, 0);
    props.history.push('/error');
  }
}
