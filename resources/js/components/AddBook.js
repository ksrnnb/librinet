import React from 'react';
import Subtitle from './Subtitle';
import GenreSelectFormat from './GenreSelectFormat';
import Errors from './Errors';
import Redirect from './Redirect';
const axios = window.axios;

export default class AddBook extends GenreSelectFormat {
  constructor(props) {
    super(props);
    this.submitBook = this.submitBook.bind(this);
    this.validation = this.validation.bind(this);
  }

  submitBook() {
    const path = '/api/book/add/' + this.state.book.isbn;

    const params = this.getParams();
    const errors = this.validation(params);

    if (errors.length) {
      this.setState({
        errors: errors,
      });
      // page上部へ
      window.scrollTo(0, 0);
    } else {
      axios
        .post(path, params)
        .then((response) => {
          const strId = response.data.str_id;
          Redirect.userProfile.call(this, strId);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  validation(params) {
    const errors = [];

    if (params.is_new_genre && params.new_genre == '') {
      errors.push('No Input Error in new Genre!');
    }

    return errors;
  }

  render() {
    const errors = this.state.errors;
    return (
      <>
        <Subtitle subtitle="本棚に追加" />
        <Errors errors={errors} />
        {super.render()}
        <button className="btn btn-outline-success" onClick={this.submitBook}>
          本棚に追加する
        </button>
      </>
    );
  }
}
