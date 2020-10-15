import React from 'react';
import { PropTypes } from 'prop-types';

export default function Genres(props) {
  const canSelectGenre = props.isChecked;
  const newGenre = props.newGenre;
  let divClass;

  if (canSelectGenre) {
    divClass = '';
  } else {
    divClass = 'invalid';
  }

  const element = (
    <div className={divClass}>
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
  const newGenre = props.newGenre;
  let disabled = !canSelectGenre;

  const isChecked = props.isNewGenre;
  // もし選択されてなかったら強制的にdisable?
  // if (!isNewGenre) {
  //   disabled = true;
  // }

  return (
    <>
      <p>ジャンルの選択</p>
      <label htmlFor="new">
        <input
          type="radio"
          name="genre"
          id="new"
          value="new"
          checked={isChecked}
          onChange={props.onChangeRadioButton}
          disabled={disabled}
        />
        新しいジャンルを入力
      </label>
      <label className="d-block" htmlFor="new_genre">
        <input
          type="text"
          name="new_genre"
          id="new-genre"
          value={newGenre}
          disabled={disabled}
          onClick={props.onClickNewGenre}
          onChange={props.onChange}
        />
      </label>
    </>
  );
}

function ConventionalGenre(props) {
  const canSelectGenre = props.canSelectGenre;
  let disabled = !canSelectGenre;

  const isChecked = !props.isNewGenre;
  // もし選択されてなかったら強制的にdisable?
  // if (isNewGenre) {
  //   disabled = true;
  // }

  const genres = props.genres;
  const genresExist = Object.keys(genres).length;

  if (genresExist) {
    const genreElements = Object.keys(genres).map((id) => {
      return (
        <option value={id} key={id} name="genre_id">
          {genres[id]}
        </option>
      );
    });

    return (
      <>
        <label htmlFor="conventional">
          <input
            type="radio"
            name="genre"
            id="conventional"
            value="conventional"
            checked={isChecked}
            disabled={disabled}
            onChange={props.onChangeRadioButton}
          />
          既存のジャンルから選択
        </label>
        <select
          name="genre_id"
          className="d-block"
          id="convSelect"
          disabled={disabled}
          value={props.convGenre}
          onClick={props.onClickConvGenre}
          onChange={props.onChangeConvGenre}
        >
          {genreElements}
        </select>
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
