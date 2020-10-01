import React from 'react';
import Subtitle from './Subtitle';
import UserCard from './UserCard';
const axios = window.axios;

function UsersExample(props) {
  let trElements = null;

  if (props.example) {
    trElements = props.example.map((user) => {
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
      <table className="table">
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
      <p className="text-danger" key={i}>
        {error}
      </p>
    );
  });

  return errors;
}

function Results(props) {
  const users = props.users.map((user) => {
    return (
      <div className="mt-3" key={user.id}>
        <UserCard user={user} />
      </div>
    );
  });

  return users;
}

export default class User extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      input: null,
      errors: [],
      users: [],
    };

    this.onChangeInput = this.onChangeInput.bind(this);
    this.onClickSearch = this.onClickSearch.bind(this);
  }

  onChangeInput(e) {
    this.setState({
      input: e.target.value,
    });
  }

  onClickSearch() {
    const input = this.state.input;
    // TODO: validation

    axios
      .post('/api/user', {
        user: input,
      })
      .then((response) => {
        const users = response.data;

        // ユーザーが存在していたら
        if (users.length) {
          this.setState({
            users: users,
          });
        } else {
          const errors = ['ユーザーが存在していません'];
          this.setState({
            errors: errors,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const errors = this.state.errors;
    const users = this.state.users;
    const example = this.props.example;

    return (
      <>
        <Subtitle subtitle="ユーザーの検索" />
        <label htmlFor="user">
          <h4 className="mt-5">ユーザーID or ユーザー名</h4>
          <Errors errors={errors} />
          <input
            type="text"
            id="user"
            name="user"
            onChange={this.onChangeInput}
          />
          <input type="button" value="検索" onClick={this.onClickSearch} />
        </label>
        <UsersExample example={example} />
        <Results users={users} />
      </>
    );
  }
}
