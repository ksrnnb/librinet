import React from 'react';
import { PropTypes } from 'prop-types';
import { Caption, TextInput, InputWithCheck, SelectBox, NoImageCard } from './Components';

export default function Genres(props) {
  const canSelectGenre = props.isChecked;
  const newGenre = props.newGenre;
  const divClass = canSelectGenre ? '' : 'invalid';

  const element = (
    <div className={divClass}>
      <Caption isTop={true} content="ジャンルの選択" />
      <NoImageCard>
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

function NewGenre(props) {
  const canSelectGenre = props.canSelectGenre;
  let disabled = !canSelectGenre;

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
          placeholder: "16文字以内で入力してください",
          disabled: disabled,
          onChange: props.onChange,
          onClick: props.onClickNewGenre,
        }}
      />
    </>
  );
}

function ConventionalGenre(props) {
  const canSelectGenre = props.canSelectGenre;
  let disabled = !canSelectGenre;

  const isChecked = !props.isNewGenre;
  const genres = props.genres;
  const genresExist = Object.keys(genres).length;

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

NewGenre.propTypes = {
  canSelectGenre: PropTypes.bool,
  newGenre: PropTypes.string,
  isNewGenre: PropTypes.bool,
  onChangeRadioButton: PropTypes.func,
  onClickNewGenre: PropTypes.func,
  onChange: PropTypes.func,
};
