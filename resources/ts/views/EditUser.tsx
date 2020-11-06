import React, { useContext, useState } from 'react';
import Subtitle from '../components/Subtitle';
import UserImageInput from '../components/UserImageInput';
import Errors from '../components/Errors';
import { MyCard } from '../components/MyCard';
import { DataContext, SetStateContext } from './App';
import { PropsContext } from '../components/MyRouter';
import { MyLink } from '../functions/MyLink';
import { Modal, Button } from 'react-bootstrap';

const axios = window.axios;

function ModalWindow(props: any) {
  const { show, handleClose, onSubmitDelete } = props;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>ユーザーの削除</Modal.Title>
      </Modal.Header>
      <Modal.Body>アカウントを削除しますか？</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          キャンセル
        </Button>
        <Button variant="primary" onClick={onSubmitDelete}>
          はい
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function EditButton(props: any) {
  return (
    <button className="btn btn-outline-success" onClick={props.onClick}>
      編集する
    </button>
  );
}

function CancelButton(props: any) {
  return (
    <button className="btn btn-outline-secondary mr-2" onClick={props.onClick}>
      キャンセルする
    </button>
  );
}

function DeleteButton(props: any) {
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

function UserNameInput(props: any) {
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

function UserStrIdInput(props: any) {
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
  const data: any = useContext(DataContext);
  const props: any = useContext(PropsContext);
  const setState: any = useContext(SetStateContext);
  const user: any = data.params.user;
  const params: any = data.params;

  const [errors, setErrors]: any = useState([]);
  const [name, setName]: any = useState(user.name);
  const [strId, setStrId]: any = useState(user.str_id);
  const [image, setImage]: any = useState(user.image || null);
  const [show, setShow]: any = useState(false);

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
      .catch((error: any) => {
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
        params.user = undefined;
        setState.params(params);
        MyLink.top(props);
      })
      .catch(() => {
        alert('エラーが発生し、削除できませんでした');
      });
  }

  const isGuest = props.match.params.strId === 'guest';

  if (params == null) {
    return <></>;
  } else {
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
                  onChange={(e: any) => setName(e.target.value)}
                />
                <UserStrIdInput
                  strId={strId}
                  isGuest={isGuest}
                  onChange={(e: any) => setStrId(e.target.value)}
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
            <DeleteButton isGuest={isGuest} onClick={() => setShow(true)} />
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
        <ModalWindow
          show={show}
          handleClose={() => setShow(false)}
          onSubmitDelete={onSubmitDelete}
        />
      </>
    );
  }
}
