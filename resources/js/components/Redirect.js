const axios = window.axios;

export default class Redirect {
  static home() {
    this.props.props.history.push('/home');
  }

  static userProfile(strId) {
    const path = '/user/profile/' + strId;
    this.props.props.history.push(path);
  }

  static editGenre(strId) {
    const path = '/genre/edit/' + strId;
    this.props.props.history.push(path);
  }

  static deleteBook(strId) {
    const path = '/book/delete/' + strId;
    this.props.props.history.push(path);
  }
}
