import React, { ReactElement } from 'react';
import Errors from './Errors';
import {
  Caption,
  TextInput,
  InputWithCheck,
  SelectBox,
  NoImageCard,
} from './Components';

export default function Genres(props: any) {
  const canSelectGenre: boolean = props.isChecked;
  const newGenre: string = props.newGenre;
  const divClass: string = canSelectGenre ? '' : 'invalid';

  const element: ReactElement = (
    <div className={divClass}>
      <Caption isTop={true} content="ジャンルの選択" />
      <NoImageCard>
        <Errors errors={props.errors} />
        <NewGenre
          canSelectGenre={canSelectGenre}
          isNewGenre={props.isNewGenre}
          newGenre={newGenre}
          onClickNewGenre={props.onClickNewGenre}
          onChange={props.onChangeNewGenre}
          onChangeRadioButton={props.onChangeRadioButton}
        />
        <ConventionalGenre
          canSelectGenre={canSelectGenre}
          genres={props.genres}
          convGenre={props.convGenre}
          isNewGenre={props.isNewGenre}
          onChangeConvGenre={props.onChangeConvGenre}
          onClickConvGenre={props.onClickConvGenre}
          onChangeRadioButton={props.onChangeRadioButton}
        />
      </NoImageCard>
    </div>
  );

  if (props.book.isInBookshelf) {
    return <></>;
  } else {
    return element;
  }
}

function NewGenre(props: any) {
  const canSelectGenre = props.canSelectGenre;
  const disabled = !canSelectGenre;

  const isChecked = props.isNewGenre;

  return (
    <>
      <InputWithCheck
        type="radio"
        name="new"
        value="new"
        checked={isChecked}
        disabled={disabled}
        onChange={props.onChangeRadioButton}
        content="新しいジャンルを入力"
      />
      <TextInput
        name="new-genre"
        attr={{
          maxLength: 16,
          placeholder: '16文字以内で入力してください',
          disabled: disabled,
          onChange: props.onChange,
          onClick: props.onClickNewGenre,
        }}
      />
    </>
  );
}

function ConventionalGenre(props: any) {
  const canSelectGenre: boolean = props.canSelectGenre;
  const disabled = !canSelectGenre;

  const isChecked = !props.isNewGenre;
  const genres: any = props.genres;
  const genresExist: number = Object.keys(genres).length;

  if (genresExist) {
    return (
      <>
        <InputWithCheck
          type="radio"
          name="conventional"
          value="conventional"
          checked={isChecked}
          disabled={disabled}
          onChange={props.onChangeRadioButton}
          content="既存のジャンルから選択"
        />
        <SelectBox
          name="genre_id"
          disabled={disabled}
          value={props.convGenre}
          onClick={props.onClickConvGenre}
          onChange={props.onChangeConvGenre}
          object={genres}
        />
      </>
    );
  } else {
    return <></>;
  }
}
