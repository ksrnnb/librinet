import React, { useContext, useEffect, useState } from 'react';
import { PropsContext } from '../components/MyRouter';
import Subtitle from '../components/Subtitle';
import UserCard from '../components/UserCard';

const axios = window.axios;

export default function Followers() {
  const props: any = useContext(PropsContext);
  const strId: any = props.match.params.strId;
  const target: any = props.match.params.target;
  const [users, setUsers]: any = useState(null);

  const path: string = '/api/followers/' + strId + '/' + target;

  useEffect(loadFollower, []);

  function loadFollower() {
    axios
      .get(path)
      .then((response: any) => {
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
        {users.map((user: any) => {
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
