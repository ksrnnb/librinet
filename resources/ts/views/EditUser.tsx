import React, { useContext, useState } from 'react';
import Subtitle from '../components/Subtitle';
import UserImageInput from '../components/UserImageInput';
import Errors from '../components/Errors';
import { MyCard } from '../components/MyCard';
import { DataContext, SetParamsContext } from './App';
import { PropsContext } from '../components/MyRouter';
import { MyLink } from '../functions/MyLink';
import { Modal, Button } from 'react-bootstrap';
import {
  ErrorResponse,
  Data,
  RouterProps,
  Params,
  SetParams,
  UserParams,
} from '../types/Interfaces';

const axios = window.axios;

interface ModalProps {
  show: boolean;
  handleClose: () => void;
  onSubmitDelete: () => void;
}

function ModalWindow(props: ModalProps) {
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

interface OnClickProps {
  onClick: () => void;
}

function EditButton(props: OnClickProps) {
  const onClick = props.onClick;
  return (
    <button className="btn btn-outline-success" onClick={onClick}>
      編集する
    </button>
  );
}

function CancelButton(props: OnClickProps) {
  const onClick = props.onClick;
  return (
    <button className="btn btn-outline-secondary mr-2" onClick={onClick}>
      キャンセルする
    </button>
  );
}

interface DeleteProps {
  isGuest: boolean;
  onClick: () => void;
}

function DeleteButton(props: DeleteProps) {
  const { isGuest, onClick } = props;
  const attr = isGuest ? { disabled: true } : {};

  return (
    <div className="mt-5">
      <button className="btn btn-outline-danger" onClick={onClick} {...attr}>
        アカウントを削除する
      </button>
    </div>
  );
}

interface NameProps {
  isGuest: boolean;
  name: string;
  onChange: (e: any) => void;
}

function UserNameInput(props: NameProps) {
  const { isGuest, name, onChange } = props;
  const attr = isGuest ? { disabled: true } : {};

  return (
    <label htmlFor="user-name" className="d-block">
      <p className="my-0">ユーザー名</p>
      <input
        id="user-name"
        className="mw-100"
        name="user-name"
        value={name}
        onChange={onChange}
        {...attr}
      />
    </label>
  );
}

interface StrIdProps {
  isGuest: boolean;
  strId: string;
  onChange: (e: any) => void;
}

function UserStrIdInput(props: StrIdProps) {
  const { isGuest, strId, onChange } = props;
  const attr = isGuest ? { disabled: true } : {};
  return (
    <label htmlFor="user-id" className="d-block">
      <p className="my-0">ユーザーID</p>
      <input
        id="user-id"
        className="mw-100"
        name="user-id"
        value={strId}
        onChange={onChange}
        {...attr}
      />
    </label>
  );
}

export default function EditUser() {
  const data: Data = useContext(DataContext);
  const props: RouterProps = useContext(PropsContext);
  const setParams: SetParams = useContext(SetParamsContext);
  const user: any = data.params.user;
  const params: Params = data.params;

  // 非ログイン時はトップへ。
  if (user == null) {
    MyLink.top(props);
    return <></>;
  }

  // 違うユーザーの編集ページにきた場合は、ユーザーページに遷移
  if (user.str_id !== props.match.params.strId) {
    MyLink.userProfile(props, props.match.params.strId);
  }

  const [errors, setErrors] = useState<string[]>([]);
  const [name, setName] = useState<string>(user.name);
  const [strId, setStrId] = useState<string>(user.str_id);
  const [image, setImage] = useState<string | null>(user.image || null);
  const [show, setShow] = useState<boolean>(false);

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
        setParams(params);
        MyLink.userProfile(props, user.str_id);
      })
      .catch((error: ErrorResponse) => {
        const errors = Object.values(error.response.data.errors) as string[];
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
        const newParams = params as any;
        newParams.user = undefined;
        setParams(newParams);
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
