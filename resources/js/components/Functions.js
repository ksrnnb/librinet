const axios = window.axios;

export default class Functions {
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
