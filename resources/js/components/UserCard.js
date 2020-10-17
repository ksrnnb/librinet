import React, { useContext } from 'react';
import { PropsContext } from './Pages';
import { PropTypes } from 'prop-types';

export function UserImage(props) {
  const image = props.image || '/img/icon.svg';

  return <img className="img-fluid" src={image} alt="user-image" />;
}

export default function UserCard(props) {
  const user = props.user;
  const pages_props = useContext(PropsContext);

  function jumpToUserPage() {
    const user = props.user;
    const path = '/user/profile/' + user.str_id;

    pages_props.history.push({
      pathname: path,
      state: { user: user },
    });
  }

  return (
    <div
      className="card user-card"
      id="user-card"
      data-id={user.id}
      onClick={jumpToUserPage}
    >
      <div className="row no-gutters">
        <div className="col-2">
          <UserImage image={user.image} />
        </div>
        <div className="col-10">
          <div className="card-body">
            <h5 className="card-title">{user.name}</h5>
            <p className="card-text">{'@' + user.str_id}</p>
          </div>
          {/* {props.children} */}
        </div>
      </div>
    </div>
  );
}

UserImage.propTypes = {
  image: PropTypes.string,
};

UserCard.propTypes = {
  user: PropTypes.object,
  UserImage: PropTypes.string,
};
