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
    if (input == null) {
      const errors = ['入力されていません'];
      this.setState({
        errors: errors,
      });
    }

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
            errors: [],
          });
        } else {
          const errors = ['ユーザーが存在していません'];
          this.setState({
            users: [],
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
    const props = this.props.props;

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
        <Results users={users} props={props} />
        <UsersExample example={example} />
      </>
    );
  }
}
