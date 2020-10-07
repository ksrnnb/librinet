import React from 'react';
import Subtitle from './Subtitle';
import UserCard from './UserCard';
import Bookshelf from './Bookshelf';

const axios = window.axios;

function EditButton(props) {
  return (
    <button className="btn btn-outline-success" onClick={props.onClick}>
      編集する
    </button>
  );
}

export default class EditGenre extends React.Component {
  constructor(props) {
    super(props);

    this.onSubmitNewGenres = this.onSubmitNewGenres.bind(this);
  }

  onSubmitNewGenres() {
    const newGenres = this.getNewGenresFromInputs();
    const path = '/api/genre/edit';
    const userId = this.props.params.user.id;

    axios
      .post(path, {
        userId: userId,
        newGenres: newGenres,
      })
      .then((response) => {
        // console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getNewGenresFromInputs() {
    const inputs = [...document.getElementsByTagName('input')];
    const newGenres = new Object();
    inputs.forEach((input) => {
      newGenres[input.dataset.id] = input.value;
    });

    return newGenres;
  }

  render() {
    // TODO: 本がない場合の処理
    const params = this.props.params;
    return (
      <>
        <Subtitle subtitle="ジャンルの編集" />
        <UserCard user={params.user} />
        <Bookshelf
          user={params.user}
          genres_books={params.genres_books}
          genres={params.genres}
          willEdit={true}
          props={this.props.props}
        />
        <EditButton onClick={this.onSubmitNewGenres} />
      </>
    );
  }
}
