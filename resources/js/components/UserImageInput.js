import React from 'react';
import { UserImage } from './UserCard';

export default function UserImageInput(props) {
  const user = props.user;
  return (
    <>
      <UserImage user={user} />
      <label htmlFor="user-image">
        <input
          type="file"
          accept="image/jpeg,image/png"
          name="user-image"
          id="user-image"
        />
      </label>
      <p>(jpeg or png)</p>
    </>
  );
}
