import React from 'react';
import { PropTypes } from 'prop-types';

export function InputWithCheck(props) {
  const { name, type, value, checked, disabled, onChange, content } = props;
  const invalid = disabled ? 'invalid' : '';
  return (
    <label className="mb-0" htmlFor={name}>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      <h5 className={`d-inline-block  ml-2 mb-0 ${invalid}`}>{content}</h5>
    </label>
  );
}

InputWithCheck.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  value: PropTypes.string,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  content: PropTypes.string,
};

export function Caption(props) {
  const margin = props.isTop ? '' : 'mt-5';
  return <h4 className={margin}>{props.content}</h4>;
}

Caption.propTypes = {
  isTop: PropTypes.bool,
  content: PropTypes.string,
};

export function MyTextarea(props) {
  const { name, content, onChange } = props;
  return (
    <label htmlFor={name} className="d-block">
      <Caption content={content} />
      <textarea
        name={name}
        id={name}
        maxLength={100}
        placeholder="100文字以内で入力してください"
        onChange={onChange}
      />
    </label>
  );
}

MyTextarea.propTypes = {
  name: PropTypes.string,
  content: PropTypes.string,
  onChange: PropTypes.func,
};

export function SelectBox(props) {
  const myObject = props.object;
  const { name, disabled, value, onClick, onChange } = props;

  const options = Object.keys(myObject).map((key) => {
    return (
      <option value={key} key={key} name={name}>
        {myObject[key]}
      </option>
    );
  });

  return (
    <select
      name={name}
      id={name}
      disabled={disabled}
      value={value}
      onClick={onClick}
      onChange={onChange}
    >
      {options}
    </select>
  );
}

SelectBox.propTypes = {
  object: PropTypes.object,
  name: PropTypes.string,
  id: PropTypes.string,
  disabled: PropTypes.bool,
  value: PropTypes.string,
  onClick: PropTypes.func,
  onChange: PropTypes.func,
};

export function GroupedSelectBox(props) {
  const { orderedBooks, genres, disabled, onChange } = props;

  const options = Object.keys(orderedBooks).map((genreId) => {
    return (
      <optgroup label={genres[genreId]} key={genreId}>
        {orderedBooks[genreId].map((book) => {
          return (
            <option value={book.id} key={book.id}>
              {book.title}
            </option>
          );
        })}
      </optgroup>
    );
  });

  return (
    <select id="select-book" disabled={disabled} onChange={onChange}>
      {options}
    </select>
  );
}

GroupedSelectBox.propTypes = {
  orderedBooks: PropTypes.object,
  genres: PropTypes.object,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};

export function ButtonWithMargin(props) {
  const { id, onClick, content } = props;
  const type = props.type || 'success'; // デフォルトはsuccess

  return (
    <button
      className={`btn btn-outline-${type} d-block my-5`}
      id={id}
      onClick={onClick}
    >
      {content}
    </button>
  );
}

ButtonWithMargin.propTypes = {
  id: PropTypes.string,
  content: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.string,
};
