import React, { useContext, useState } from 'react';
import Subtitle from '../components/Subtitle';
import UserImageInput from '../components/UserImageInput';
import Errors from '../components/Errors';
import { MyCard } from '../components/MyCard';
import { PropTypes } from 'prop-types';
import { DataContext, SetStateContext } from './App';
import { PropsContext } from '../components/MyRouter';
import { MyLink } from '../functions/MyLink';

const axios = window.axios;

function EditButton(props) {
  return (
    <button className="btn btn-outline-success" onClick={props.onClick}>
      編集する
    </button>
  );
}

function CancelButton(props) {
  return (
    <button className="btn btn-outline-secondary mr-2" onClick={props.onClick}>
      キャンセルする
    </button>
  );
}

function DeleteButton(props) {
  const attr = props.isGuest ? { disabled: true } : {};
  return (
    <div className="mt-5">
      <button
        className="btn btn-outline-danger"
        onClick={props.onClick}
        {...attr}
      >
        アカウントを削除する
      </button>
    </div>
  );
}

function UserNameInput(props) {
  const attr = props.isGuest ? { disabled: true } : {};
  return (
    <label htmlFor="user-name" className="d-block">
      <p className="my-0">ユーザー名</p>
      <input
        id="user-name"
        className="mw-100"
        name="user-name"
        value={props.name}
        onChange={props.onChange}
        {...attr}
      />
    </label>
  );
}

function UserStrIdInput(props) {
  const attr = props.isGuest ? { disabled: true } : {};
  return (
    <label htmlFor="user-id" className="d-block">
      <p className="my-0">ユーザーID</p>
      <input
        id="user-id"
        className="mw-100"
        name="user-id"
        value={props.strId}
        onChange={props.onChange}
        {...attr}
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
  const [image, setImage] = useState(user.image || null);

  function onSubmitEdit() {
    const path = '/api/user/edit';

    user.name = name;
    user.str_id = strId;
    user.image = image;

    axios
      .post(path, {
        user: user,
      })
      .then(() => {
        params.user = user;
        setState.params(params);
        MyLink.userProfile(props, user.str_id);
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
        MyLink.home(props);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const isGuest = props.match.params.strId === 'guest';

  if (params != null) {
    return (
      <>
        <div className="row mx-0">
          <Subtitle subtitle="ユーザーの編集" />
          <MyCard
            image={<UserImageInput image={image} setImage={setImage} />}
            body={
              <div className="card-body-wrapper">
                <Errors errors={errors} />
                <UserNameInput
                  name={name}
                  isGuest={isGuest}
                  onChange={(e) => setName(e.target.value)}
                />
                <UserStrIdInput
                  strId={strId}
                  isGuest={isGuest}
                  onChange={(e) => setStrId(e.target.value)}
                />
                {isGuest && (
                  <p className="text-danger mb-0">
                    注意：ゲストユーザーの名前とIDは編集できません
                  </p>
                )}
              </div>
            }
          />
        </div>
        <div className="row justify-content-end mx-0">
          <div className="float-right mt-5">
            <CancelButton
              onClick={() => MyLink.userProfile(props, user.str_id)}
            />
            <EditButton onClick={onSubmitEdit} />
          </div>
        </div>
        <div className="row justify-content-end mx-0">
          <div className="float-right">
            <DeleteButton isGuest={isGuest} onClick={onSubmitDelete} />
          </div>
        </div>
        <div className="row justify-content-end mx-0">
          <div className="float-right">
            {isGuest && (
              <p className="text-danger mb-0">
                注意：ゲストユーザは削除できません
              </p>
            )}
          </div>
        </div>
      </>
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
  isGuest: PropTypes.bool,
};

EditButton.propTypes = {
  onClick: PropTypes.func,
};

UserNameInput.propTypes = {
  name: PropTypes.string,
  onChange: PropTypes.func,
  isGuest: PropTypes.bool,
};

UserStrIdInput.propTypes = {
  strId: PropTypes.string,
  onChange: PropTypes.func,
  isGuest: PropTypes.bool,
};
