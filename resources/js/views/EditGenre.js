import React, { useContext } from 'react';
import Subtitle from '../components/Subtitle';
import UserCard from '../components/UserCard';
import Bookshelf from '../components/Bookshelf';
import { PropTypes } from 'prop-types';
import { DataContext, SetStateContext } from './App';
import { PropsContext } from '../components/MainColumn';
import { MyLink } from '../functions/MyLink';

const axios = window.axios;

function EditButton(props) {
  return (
    <button className="btn btn-outline-success my-5" onClick={props.onClick}>
      編集する
    </button>
  );
}

export default function EditGenre() {
  const params = useContext(DataContext).params;
  const props = useContext(PropsContext);
  const setState = useContext(SetStateContext);

  function onSubmitNewGenres() {
    const newGenres = getNewGenresFromInputs();
    const path = '/api/genre/edit';
    const userId = params.user.id;

    axios
      .post(path, {
        userId: userId,
        newGenres: newGenres,
      })
      .then((response) => {
        setState.params(response.data);
        MyLink.userProfile(props, params.user.str_id);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function getNewGenresFromInputs() {
    const inputs = [...document.getElementsByTagName('input')];
    const newGenres = new Object();
    inputs.forEach((input) => {
      newGenres[input.dataset.id] = input.value;
    });

    return newGenres;
  }

  // TODO: 本がない場合の処理
  return (
    <>
      <Subtitle subtitle="ジャンルの編集" />
      <UserCard user={params.user} />
      <Bookshelf
        user={params.user}
        orderedBooks={params.user.ordered_books}
        genres={params.user.genres}
        willEdit={true}
      />
      <EditButton onClick={onSubmitNewGenres} />
    </>
  );
}

EditButton.propTypes = {
  onClick: PropTypes.func,
};