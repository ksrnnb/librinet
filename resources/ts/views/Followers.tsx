import React, { useContext, useEffect, useState } from 'react';
import { PropsContext } from '../components/MyRouter';
import Subtitle from '../components/Subtitle';
import UserCard from '../components/UserCard';
import { User, Response } from '../types/Interfaces';

const axios = window.axios;

export default function Followers() {
  const props = useContext(PropsContext);
  const strId = props.match.params.strId;
  const target = props.match.params.target;
  const [users, setUsers] = useState<User[] | null>(null);

  const path = '/api/followers/' + strId + '/' + target;

  useEffect(loadFollower, []);

  function loadFollower() {
    axios
      .get(path)
      .then((response: Response) => {
        setUsers(response.data);
      })
      .catch(() => {
        alert('予期しないエラーが発生しました');
      });
  }

  const subtitle = target === 'follows' ? 'フォロー' : 'フォロワー';

  if (users) {
    return (
      <>
        <Subtitle subtitle={subtitle} />
        {users.map((user: User) => {
          return (
            <div className="mt-2" key={user.id}>
              <UserCard user={user} useLink={true} />
            </div>
          );
        })}
      </>
    );
  } else {
    return <></>;
  }
}
