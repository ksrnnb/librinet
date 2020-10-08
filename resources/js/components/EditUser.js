import React from 'react';
import Subtitle from './Subtitle';
import UserImageInput from './UserImageInput';
import Redirect from './Redirect';

const axios = window.axios;

function EditButton(props) {
  return (
    <div className="col-12">
      <button className="btn btn-outline-success" onClick={props.onClick}>
        編集する
      </button>
    </div>
  );
}

function CancelButton(props) {
  return (
    <div className="col-12">
      <button className="btn btn-outline-success" onClick={props.onClick}>
        キャンセルする
      </button>
    </div>
  );
}

function DeleteButton(props) {
  return (
    <div className="col-12">
      <button className="btn btn-outline-danger">アカウントを削除する</button>
    </div>
  );
}

function SetPasswordButton(props) {
  return (
    <div className="col-12">
      <button className="btn btn-outline-success">
        パスワードを再設定する
      </button>
    </div>
  );
}

function UserNameInput(props) {
  return (
    <label htmlFor="user-name" className="d-block">
      <p>ユーザー名</p>
      <input
        className="h4"
        id="user-name"
        name="user-name"
        value={props.name}
        onChange={props.onChange}
        required
      />
    </label>
  );
}

function UserStrIdInput(props) {
  return (
    <label htmlFor="user-id" className="d-block">
      <p>ID</p>
      <input
        className="h4"
        id="user-id"
        name="user-id"
        value={props.strId}
        onChange={props.onChange}
        required
      />
    </label>
  );
}

export default class EditUser extends React.Component {
  constructor(props) {
    super(props);

    const user = props.params.user;

    this.state = {
      strId: user.str_id,
      name: user.name,
      image: user.image ? user.image : null,
    };

    this.onSubmitEdit = this.onSubmitEdit.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeStrId = this.onChangeStrId.bind(this);
    this.redirectUserProfile = this.redirectUserProfile.bind(this);
  }

  onSubmitEdit() {
    const path = '/api/user/edit';

    const user = this.props.params.user;
    user.name = this.state.name;
    user.str_id = this.state.strId;

    axios
      .post(path, {
        user: user,
      })
      .then((response) => {
        this.props.setStateUser(user);
        this.redirectUserProfile(user.str_id);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  onChangeName(e) {
    const name = e.target.value;
    this.setState({
      name: name,
    });
  }

  onChangeStrId(e) {
    const strId = e.target.value;
    this.setState({
      strId: strId,
    });
  }

  redirectUserProfile(strId) {
    Redirect.userProfile.call(this, strId);
  }

  render() {
    const params = this.props.params;
    const props = this.props.props;

    if (params != null) {
      return (
        <div className="row">
          <Subtitle subtitle="Edit Profile" />
          <div className="row">
            <div className="col-3">
              <UserImageInput user={params.user} />
              {/* TODO: validation error */}
            </div>

            <div className="col-9">
              <UserNameInput
                name={this.state.name}
                onChange={this.onChangeName}
              />
              <UserStrIdInput
                strId={this.state.strId}
                onChange={this.onChangeStrId}
              />
            </div>
          </div>
          <div className="row">
            <EditButton onClick={this.onSubmitEdit} />
            <CancelButton onClick={this.redirectUserProfile} />
            {/* TODO: メールは？ */}
            <SetPasswordButton />
            <DeleteButton />
          </div>
        </div>
      );
    } else {
      return <></>;
    }
  }
}
