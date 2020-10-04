import React from 'react';

function UserImage(props) {
  if (props.user.image) {
    return (
      <img
        className="img-fluid"
        src={props.user.image}
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
      <div className="user-card row border">
        <div className="col-2">
          <UserImage user={user} onClick={this.moveUserPage} />
        </div>
        <div className="col-10">
          <p className="h4">{user.name}</p>
          <p className="h5">{'@' + user.str_id}</p>
          {this.props.children}
        </div>
      </div>
    );
  }
}
