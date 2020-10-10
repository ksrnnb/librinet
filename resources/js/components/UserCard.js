import React from 'react';

export function UserImage(props) {
  if (props.image) {
    return (
      <img
        className="img-fluid"
        src={props.image}
        alt="user-image"
        onClick={props.onClick}
      />
    );
  } else {
    return (
      <img
        className="img-fluid"
        src="/img/icon.svg"
        alt="user-image"
        onClick={props.onClick}
      />
    );
  }
}

export default class UserCard extends React.Component {
  constructor(props) {
    super(props);
  }

  moveUserPage() {
    // TODO: ユーザーページへのリンク
  }

  render() {
    const user = this.props.user;

    return (
      <div className="user-card row border" id="user-card" data-id={user.id}>
        <div className="col-3">
          <UserImage image={user.image} onClick={this.moveUserPage} />
        </div>
        <div className="col-9">
          <p className="h4">{user.name}</p>
          <p className="h5">{'@' + user.str_id}</p>
          {this.props.children}
        </div>
      </div>
    );
  }
}
