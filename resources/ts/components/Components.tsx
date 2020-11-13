import React, {
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  FormEvent,
  ReactNode,
} from 'react';
import Errors from './Errors';
import { Book } from '../types/Interfaces';

interface InputWithCheckProps {
  name: string;
  type: string;
  value?: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  content: string;
}

export function InputWithCheck(props: InputWithCheckProps) {
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

interface CaptionProps {
  isTop?: boolean;
  content: string;
}

export function Caption(props: CaptionProps) {
  const margin = props.isTop ? '' : 'mt-5';
  return <h4 className={margin}>{props.content}</h4>;
}

interface MyNavProps {
  content: string;
  dusk: string;
  isActive: boolean;
  onClick: () => void;
}

export function MyNav(props: MyNavProps) {
  const { content, dusk, isActive, onClick } = props;
  const className = isActive ? 'mt-5 hover text-success' : 'mt-5 hover';

  return (
    <h4 className={className} onClick={onClick} data-dusk={dusk}>
      {content}
    </h4>
  );
}

interface MyTextAreaProps {
  name: string;
  content: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

export function MyTextarea(props: MyTextAreaProps) {
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

interface SelectBoxInterface {
  object: any;
  name: string;
  disabled: boolean;
  value: string;
  onClick: (e: MouseEvent<HTMLSelectElement>) => void;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export function SelectBox(props: SelectBoxInterface) {
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

interface GroupedSelectBoxProps {
  orderedBooks: any;
  genres: any;
  disabled: boolean;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export function GroupedSelectBox(props: GroupedSelectBoxProps) {
  const { orderedBooks, genres, disabled, onChange } = props;

  const options = Object.keys(orderedBooks).map((genreId) => {
    return (
      <optgroup label={genres[genreId]} key={genreId}>
        {orderedBooks[genreId].map((book: Book) => {
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

interface MyButtonProps {
  id?: string;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  content: string;
  type?: string;
  withMargin?: boolean;
}

export function MyButton(props: MyButtonProps) {
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

interface TextInputProps {
  type?: string;
  name: string;
  autoComplete?: string;
  content?: string;
  placeholder?: string;
  maxLength?: number;
  attr?: any;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
}

export function TextInput(props: TextInputProps) {
  const {
    name,
    autoComplete,
    content,
    placeholder,
    maxLength,
    attr,
    onChange,
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

interface NoImageCardProps {
  bgColor?: string;
  margin?: string;
  children: ReactNode;
}

export function NoImageCard(props: NoImageCardProps) {
  const { bgColor, margin } = props;

  return (
    <div className={`shadow p-4 my-card ${bgColor} ${margin}`}>
      {props.children}
    </div>
  );
}

interface SearchFormProps {
  name: string;
  content: string;
  subMessage?: string;
  maxLength?: number;
  errors: string[];
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (
    e: MouseEvent<HTMLButtonElement> | FormEvent<HTMLFormElement>
  ) => void;
}

export function SearchForm(props: SearchFormProps) {
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
