import React, { useContext, useState } from 'react';
import Subtitle from './Subtitle';
import UserCard from './UserCard';
import { DataContext } from './App';
import { PropTypes } from 'prop-types';

const axios = window.axios;

function UsersExample(props) {
  let trElements = null;

  if (props.examples) {
    trElements = props.examples.map((user) => {
      return (
        <tr key={user.id}>
          <td>{user.str_id}</td>
          <td>{user.name}</td>
        </tr>
      );
    });
  }

  return (
    <>
      <h3 className="mt-5">ユーザー例</h3>
      <table className="table shadow">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
          </tr>
        </thead>

        <tbody>{trElements}</tbody>
      </table>
    </>
  );
}

function Errors(props) {
  const errors = props.errors.map((error, i) => {
    return (
      <p className="error text-danger" key={i}>
        {error}
      </p>
    );
  });

  return errors;
}

function Results(props) {
  const users = props.users.map((user, i) => {
    if (i === 0) {
      return (
        <div className="results mt-3" key={user.id}>
          <h2 className="mt-5" key="results">
            検索結果
          </h2>

          <UserCard user={user} props={props.props} />
        </div>
      );
    } else {
      return (
        <div className="mt-3" key={user.id}>
          <UserCard user={user} />
        </div>
      );
    }
  });

  return users;
}

export default function User() {
  const [input, setInput] = useState('');
  const [errors, setErrors] = useState([]);
  const [users, setUsers] = useState([]);
  const data = useContext(DataContext);
  const examples = data.params.examples;

  function onClickSearch() {
    if (input === '') {
      setErrors(['フォームが入力されていません']);
    } else {
      axios
        .post('/api/user', {
          user: input,
        })
        .then((response) => {
          const users = response.data;

          // ユーザーが存在していたら
          if (users.length) {
            setUsers(users);
            setErrors([]);
          } else {
            const errors = ['ユーザーが存在していません'];
            setUsers([]);
            setErrors(errors);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  return (
    <>
      <Subtitle subtitle="ユーザーの検索" />
      <label htmlFor="user">
        <h4>ユーザーID または ユーザー名を入力してください</h4>
        <Errors errors={errors} />
        <input
          className="mr-3 py-0"
          type="text"
          id="user"
          name="user"
          onChange={(e) => setInput(e.target.value)}
        />
        <input type="button" className="btn btn-outline-success" value="検索" onClick={onClickSearch} />
      </label>
      <Results users={users} />
      <UsersExample examples={examples} />
    </>
  );
}

Results.propTypes = {
  users: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array, // 検索前はarray
  ]),
};

UsersExample.propTypes = {
  examples: PropTypes.array,
};

Errors.propTypes = {
  errors: PropTypes.array,
};
