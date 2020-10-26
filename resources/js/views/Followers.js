import React, { useContext, useEffect, useState } from 'react';
import { PropsContext } from '../components/MainColumn';
import Subtitle from '../components/Subtitle';
import UserCard from '../components/UserCard';

const axios = window.axios;

export default function Followers() {
  const props = useContext(PropsContext);
  const strId = props.match.params.strId;
  const target = props.match.params.target;
  const [users, setUsers] = useState(null);

  const path = '/api/followers/' + strId + '/' + target;

  useEffect(loadFollower, []);

  function loadFollower() {
    axios
      .get(path)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const subtitle = target === 'follows' ? 'フォロー' : 'フォロワー';

  if (users) {
    return (
      <>
        <Subtitle subtitle={subtitle} />
        {users.map((user) => {
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
