import React, { useContext, useState } from 'react';
import Subtitle from '../components/Subtitle';
import UserImageInput from '../components/UserImageInput';
import Errors from '../components/Errors';
import { MyCard } from '../components/MyCard';
import { PropTypes } from 'prop-types';
import { DataContext, SetStateContext } from './App';
import { PropsContext } from '../components/MainColumn';
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
  return (
    <div className="mt-5">
      <button className="btn btn-outline-danger" onClick={props.onClick}>
        アカウントを削除する
      </button>
    </div>
  );
}

// function SetPasswordButton() {
//   return (
//     <div className="col-12">
//       <button className="btn btn-outline-success">
//         パスワードを再設定する
//       </button>
//     </div>
//   );
// }

function UserNameInput(props) {
  return (
    <label htmlFor="user-name" className="d-block">
      <p className="my-0">ユーザー名</p>
      <input
        id="user-name"
        className="max-w-100"
        name="user-name"
        value={props.name}
        onChange={props.onChange}
      />
    </label>
  );
}

function UserStrIdInput(props) {
  return (
    <label htmlFor="user-id" className="d-block">
      <p className="my-0">ユーザーID</p>
      <input
        id="user-id"
        className="max-w-100"
        name="user-id"
        value={props.strId}
        onChange={props.onChange}
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
      .then(() => {
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
        MyLink.home(props);
      })
      .catch((error) => {
        console.log(error);
      });
  }

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
                  onChange={(e) => setName(e.target.value)}
                />
                <UserStrIdInput
                  strId={strId}
                  onChange={(e) => setStrId(e.target.value)}
                />
              </div>
            }
          />
        </div>
        <div className="row justify-content-end mx-0">
          <div className="float-right mt-5">
            <CancelButton onClick={() => MyLink.userProfile(props, user.str_id)} />
            <EditButton onClick={onSubmitEdit} />
          </div>
        </div>
        {/* TODO: メールは？ */}
        {/* <SetPasswordButton /> */}
        <div className="row justify-content-end mx-0">
          <div className="float-right">
            <DeleteButton onClick={onSubmitDelete} />
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
