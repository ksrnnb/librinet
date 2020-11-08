import React, { useContext } from 'react';
import Subtitle from '../components/Subtitle';
import UserCard from '../components/UserCard';
import Bookshelf from '../components/Bookshelf';
import { DataContext, SetParamsContext } from './App';
import { PropsContext } from '../components/MyRouter';
import { MyLink } from '../functions/MyLink';
import {
  Response,
  Data,
  RouterProps,
  Params,
  SetParams,
} from '../types/Interfaces';

const axios = window.axios;

function EditButton(props: any) {
  return (
    <button className="btn btn-outline-success my-5" onClick={props.onClick}>
      編集する
    </button>
  );
}

export default function EditGenre() {
  const data: Data = useContext(DataContext);
  const params: Params = data.params;
  const props: RouterProps = useContext(PropsContext);
  const setParams: SetParams = useContext(SetParamsContext);

  function onSubmitNewGenres() {
    const newGenres = getNewGenresFromInputs();
    const path = '/api/genre/edit';

    axios
      .post(path, {
        newGenres: newGenres,
      })
      .then((response: Response) => {
        setParams(response.data);
        MyLink.userProfile(props, params.user.str_id);
      })
      .catch(() => {
        alert('エラーが発生し、ジャンルが編集できませんでした');
      });
  }

  function getNewGenresFromInputs() {
    const elements: any = document.getElementsByTagName('input');
    const inputs: any = [...elements];
    const newGenres: any = new Object();
    inputs.forEach((input: any) => {
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
