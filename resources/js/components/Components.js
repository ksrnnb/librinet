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
      <NoImageCard>
        <textarea
          name={name}
          id={name}
          maxLength={100}
          placeholder="100文字以内で入力してください"
          onChange={onChange}
        />
      </NoImageCard>
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
      className="w-adjust"
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

export function MyButton(props) {
  const { id, onClick, content } = props;
  const type = props.type || 'success'; // デフォルトはsuccess
  const margin = props.withMargin ? "my-5" : "";

  return (
    <button
      className={`btn btn-outline-${type} d-block ${margin}`}
      id={id}
      onClick={onClick}
    >
      {content}
    </button>
  );
}

MyButton.propTypes = {
  id: PropTypes.string,
  content: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.string,
};

export function TextInput(props) {
  const { name, autoComplete, onChange, content, attr } = props;
  const type = props.type || "text";
  return (
    <label htmlFor={name} className="d-block">
      <h5>{content}</h5>
      <input
        type={type}
        name={name}
        id={name}
        autoComplete={autoComplete}
        className="d-block w-adjust"
        onChange={onChange}
        {...attr}
      />
    </label>
  );
}

TextInput.propTypes = {
  name: PropTypes.string,
  autoComplete: PropTypes.string,
  onChange: PropTypes.func,
  content: PropTypes.string,
  attr: PropTypes.object
};

export function NoImageCard(props) {
  const { bgColor, margin } = props;

  return (
    <div className={`shadow p-4 my-card ${bgColor} ${margin}`}>
      {props.children}
    </div>
  );
}

NoImageCard.propTypes = {
  bgColor: PropTypes.string,
  margin: PropTypes.string,
}

// export function SearchForm(props) {

//   return (
//     <label htmlFor={name}>
//       <h5>{content}</h5>
//       <p>{subMessage}</p>
//       <input
//         className="mr-3 py-0"
//         type="text"
//         id={name}
//         name={name}
//         maxLength={13}
//         onChange={props.onChange}
//       />
//       <button
//         type="button"
//         id="search"
//         className="btn btn-outline-success"
//         onClick={props.onClick}
//       >
//         検索
//       </button>
//     </label >
//   );
// }