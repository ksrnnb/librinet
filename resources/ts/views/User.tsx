import React, {
  useContext,
  useState,
  ChangeEvent,
  FormEvent,
  MouseEvent,
} from 'react';
import Subtitle from '../components/Subtitle';
import UserCard from '../components/UserCard';
import { DataContext } from './App';
import { SearchForm, Caption } from '../components/Components';
import { PropsContext } from '../components/MyRouter';
import { User, Response } from '../types/Interfaces';

const axios = window.axios;

function UsersExample(props: { examples: User[] }) {
  let trElements = null;

  if (props.examples) {
    trElements = props.examples.map((user: User) => {
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
      <Caption content="ユーザー例" />
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

function Results(props: { users: User[] }) {
  const users = props.users.map((user: User, i: number) => {
    if (i === 0) {
      return (
        <div className="results mt-3" key={user.id}>
          <Caption content="検索結果" />
          <UserCard user={user} useLink={true} />
        </div>
      );
    } else {
      return (
        <div className="mt-3" key={user.id}>
          <UserCard user={user} useLink={true} />
        </div>
      );
    }
  });

  return <>{users}</>;
}

export default function User() {
  const [input, setInput] = useState<string>('');
  const [errors, setErrors] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const data = useContext(DataContext);
  const examples = data.params.examples;
  const props = useContext(PropsContext);

  function searchUser(
    e: MouseEvent<HTMLButtonElement> | FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (input === '') {
      setErrors(['フォームが入力されていません']);
    } else {
      axios
        .post('/api/user', {
          user: input,
        })
        .then((response: Response) => {
          const canUpdate = props.history.location.pathname === '/user';
          // 検索中にページ遷移していた場合はstate更新しない
          if (canUpdate) {
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
          }
        })
        .catch(() => {
          alert('ユーザーの検索時にエラーが発生しました');
        });
    }
  }

  return (
    <>
      <Subtitle subtitle="ユーザーの検索" />
      <Caption isTop={true} content="検索フォーム" />
      <SearchForm
        name="user"
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setInput(e.target.value)
        }
        onSubmit={searchUser}
        content="ユーザーID または ユーザー名を入力してください"
        maxLength={16}
        errors={errors}
      />
      <Results users={users} />
      <UsersExample examples={examples} />
    </>
  );
}
