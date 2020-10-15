import React, { useContext, useState } from 'react';
import Subtitle from './Subtitle';
import UserImageInput from './UserImageInput';
import Errors from './Errors';
import { PropTypes } from 'prop-types';
import { DataContext, SetStateContext } from './App';
import { PropsContext } from './Pages';

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
      <button className="btn btn-outline-danger" onClick={props.onClick}>
        アカウントを削除する
      </button>
    </div>
  );
}

function SetPasswordButton() {
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

export default function EditUser() {
  const data = useContext(DataContext);
  const props = useContext(PropsContext);
  const setState = useContext(SetStateContext);
  const user = data.params.user;
  const params = data.params;

  const [errors, setErrors] = useState([]);
  const [name, setName] = useState(user.name);
  const [strId, setStrId] = useState(user.str_id);
  const [image, setImage] = useState(user.image ? user.image : null);

  function onSubmitEdit() {
    const path = '/api/user/edit';

    user.name = name;
    user.str_id = strId;
    user.image = image;

    axios
      .post(path, {
        user: user,
      })
      .then((response) => {
        console.log(response);
        params.user = user;
        setState.params(params);
        redirectUserProfile(user.str_id);
      })
      .catch((error) => {
        const errors = Object.values(error.response.data.errors);
        setErrors(errors);
      });
  }

  function onSubmitDelete() {
    const path = '/api/user';

    axios
      .delete(path, {
        data: user,
      })
      .then(() => {
        params.user = {};
        setState.params(params);
        props.history.push('/home');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function redirectUserProfile(strId) {
    const path = '/user/profile/' + strId;
    props.history.push(path);
  }

  if (params != null) {
    return (
      <div className="row">
        <Subtitle subtitle="Edit Profile" />
        <div className="row">
          <div className="col-3">
            <UserImageInput image={image} setImage={setImage} />
            {/* TODO: validation error */}
          </div>

          <div className="col-9">
            <Errors errors={errors} />
            <UserNameInput
              name={name}
              onChange={(e) => setName(e.target.value)}
            />
            <UserStrIdInput
              strId={strId}
              onChange={(e) => setStrId(e.target.value)}
            />
          </div>
        </div>
        <div className="row">
          <EditButton onClick={onSubmitEdit} />
          <CancelButton onClick={redirectUserProfile} />
          {/* TODO: メールは？ */}
          <SetPasswordButton />
          <DeleteButton onClick={onSubmitDelete} />
        </div>
      </div>
    );
  } else {
    return <></>;
  }
}

CancelButton.propTypes = {
  onClick: PropTypes.func,
};

DeleteButton.propTypes = {
  onClick: PropTypes.func,
};

EditButton.propTypes = {
  onClick: PropTypes.func,
};

UserNameInput.propTypes = {
  name: PropTypes.string,
  onChange: PropTypes.func,
};

UserStrIdInput.propTypes = {
  strId: PropTypes.string,
  onChange: PropTypes.func,
};
