import React from 'react';
import { PropsContext } from './Pages';

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

    this.jumpToUserPage = this.jumpToUserPage.bind(this);
  }

  jumpToUserPage(e) {
    const user = this.props.user;
    const path = '/user/profile/' + user.str_id;
    const props = this.props.props;

    props.history.push({
      pathname: path,
      state: { user: user },
    });
  }

  render() {
    const user = this.props.user;

    return (
      <div
        className="card user-card"
        id="user-card"
        data-id={user.id}
        onClick={this.jumpToUserPage}
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
            {/* {this.props.children} */}
          </div>
        </div>
      </div>
    );
  }
}
