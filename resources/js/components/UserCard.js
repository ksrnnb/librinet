import React, { useContext } from 'react';
import { PropsContext } from './MyRouter';
import { PropTypes } from 'prop-types';
import { MyCard } from './MyCard';
import { MyLink } from '../functions/MyLink';

export function UserImage(props) {
  const image = props.image || '/img/icon.svg';

  return (
    <div className="user-image">
      <img className="img-fluid w-100" src={image} alt="user-image" />
    </div>
  );
}

export default function UserCard(props) {
  const user = props.user;
  const main_props = useContext(PropsContext);

  const userLink = () => MyLink.userProfile(main_props, user.str_id, user);

  const attr = props.useLink
    ? { onClick: userLink, addingClass: 'user-card hover' }
    : { addingClass: 'user-card' };

  return (
    <MyCard
      image={<UserImage image={user.image} />}
      body={
        <>
          <p className="user-name my-0 one-row">{user.name}</p>
          <p className="user-id my-0 one-row">{'@' + user.str_id}</p>
          {props.children}
        </>
      }
      {...attr}
    />
  );
}

UserImage.propTypes = {
  image: PropTypes.string,
};

UserCard.propTypes = {
  user: PropTypes.object,
  UserImage: PropTypes.string,
  useLink: PropTypes.bool,
  children: PropTypes.array,
};
