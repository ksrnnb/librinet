const axios = window.axios;

export default class Functions {
  redirectHome() {
    // axios
    //   .get('/api/home')
    //   .then((response) => {
    this.props.props.history.push('/home');
    // })
    // .catch((error) => {
    //   console.log(error);
    // });
  }

  redirectToUserProfile(strId) {
    const path = '/user/profile/' + strId;
    this.props.props.history.push(path);
  }
}
