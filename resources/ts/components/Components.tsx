import React from 'react';
import Errors from './Errors';

export function InputWithCheck(props: any) {
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
      <h5 className={`d-inline-block ml-2 mb-0 ${invalid}`}>{content}</h5>
    </label>
  );
}

export function Caption(props: any) {
  const margin = props.isTop ? '' : 'mt-5';
  return <h4 className={margin}>{props.content}</h4>;
}

export function MyTextarea(props: any) {
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

export function SelectBox(props: any) {
  const myObject = props.object;
  const { name, disabled, value, onClick, onChange } = props;

  const options = Object.keys(myObject).map((key) => {
    return (
      <option value={key} key={key}>
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

export function GroupedSelectBox(props: any) {
  const { orderedBooks, genres, disabled, onChange } = props;

  const options = Object.keys(orderedBooks).map((genreId) => {
    return (
      <optgroup label={genres[genreId]} key={genreId}>
        {orderedBooks[genreId].map((book: any) => {
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
    <select
      id="select-book"
      className="mw-100"
      disabled={disabled}
      onChange={onChange}
    >
      {options}
    </select>
  );
}

export function MyButton(props: any) {
  const { id, onClick, content } = props;
  const type = props.type || 'success'; // デフォルトはsuccess
  const margin = props.withMargin ? 'my-5' : '';

  return (
    <button
      type="button"
      className={`btn btn-outline-${type} d-block ${margin}`}
      id={id}
      onClick={onClick}
    >
      {content}
    </button>
  );
}

export function TextInput(props: any) {
  const {
    name,
    autoComplete,
    onChange,
    content,
    placeholder,
    maxLength,
    attr,
    onKeyDown,
  } = props;
  const type = props.type || 'text';
  return (
    <label htmlFor={name} className="d-block">
      <h5>{content}</h5>
      <input
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        maxLength={maxLength}
        autoComplete={autoComplete}
        className="d-block w-adjust"
        onChange={onChange}
        onKeyDown={onKeyDown}
        {...attr}
      />
    </label>
  );
}

export function NoImageCard(props: any) {
  const { bgColor, margin } = props;

  return (
    <div className={`shadow p-4 my-card ${bgColor} ${margin}`}>
      {props.children}
    </div>
  );
}

export function SearchForm(props: any) {
  const {
    name,
    content,
    subMessage,
    maxLength,
    onChange,
    onSubmit,
    errors,
  } = props;

  return (
    <NoImageCard>
      <form onSubmit={onSubmit}>
        <label htmlFor={name}>
          <h5>{content}</h5>
          <p>{subMessage}</p>
          <Errors errors={errors} />
          <input
            className="mr-3 py-0 d-inline-block search-input"
            type="text"
            id={name}
            name={name}
            maxLength={maxLength}
            onChange={onChange}
          />
          <button
            type="button"
            id="search"
            className="btn btn-outline-success"
            onClick={onSubmit}
          >
            検索
          </button>
        </label>
      </form>
    </NoImageCard>
  );
}
