const axios = window.axios;

export default class Functions {
  redirectHome() {
    axios
      .get('/api/home')
      .then((response) => {
        console.log(response);
        this.props.props.history.push('/home');
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
