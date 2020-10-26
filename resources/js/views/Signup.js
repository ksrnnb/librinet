import { DataContext, SetStateContext } from './App';
import { PropsContext } from '../components/MainColumn';
import Subtitle from '../components/Subtitle';
import Errors from '../components/Errors';
import { TextInput, MyButton, NoImageCard } from '../components/Components';
import React, { useContext, useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import { MyLink } from '../functions/MyLink';

const axios = window.axios;

export default function Signup() {
  const [userName, setUserName] = useState('');
  const [strId, setStrId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const props = useContext(PropsContext);
  const isLogin = useContext(DataContext).isLogin;
  const setState = useContext(SetStateContext);

  useEffect(() => {
    isLogin && MyLink.home(props);
  }, []);

  function onClickSignup() {
    const validated = validation();

    if (validated) {
      axios
        .get('/sanctum/csrf-cookie')
        .then(() => {
          axios
            .post('/api/signup', {
              name: userName,
              str_id: strId,
              email: email,
              password: password,
              password_confirmation: confirmPassword,
            })
            .then((response) => {
              const params = response.data;
              setState.params(params);
              setState.isLogin(true);
              MyLink.home(props);
            })
            .catch((error) => {
              console.log('--error----');
              console.log(error);
              // validation errorの場合
              if (error.response.status === 422) {
                const errors = Object.values(error.response.data.errors);
                setErrors(errors);
              }
            });
        })
        .catch(() => {
          alert('Error happened.');
        });
    }
  }

  function validation() {
    const newErrors = [];

    // \x20: 半角スペース, \u3000: 全角スペース
    const isUserName = /^[^\x20\u3000]{1,32}$/;
    const isUserId = /^\w{4,32}$/;
    const isEmail = /\w+@[a-zA-z_\.]+/;
    const isPasswordCharacter = /^[\w\|\^\$\*\+\?\.\(\)\[\]\/\\!@#$%&-_+={}:;"'?>.,<`~]{6,255}$/;

    if (!isUserName.test(userName)) {
      newErrors.push('ユーザー名が正しく入力されていません');
    }

    if (!isUserId.test(strId)) {
      newErrors.push('ユーザーIDが正しく入力されていません');
    }

    if (!isEmail.test(email)) {
      newErrors.push('メールアドレスが正しく入力されていません');
    }

    if (password !== confirmPassword) {
      newErrors.push('パスワードが一致していません');
    }

    if (!isPasswordCharacter.test(password)) {
      newErrors.push('パスワードが正しく入力されていません');
    }

    if (!isPasswordCharacter.test(confirmPassword)) {
      newErrors.push('確認用パスワードが正しく入力されていません');
    }

    if (newErrors.length) {
      setErrors(newErrors);
      return false;
    }

    return true;
  }

  return (
    <>
      <Subtitle subtitle="ユーザーの登録" />
      <Errors errors={errors} />
      <NoImageCard margin="mb-5">
        <form>
          <TextInput
            name="user-name"
            content="ユーザー名"
            placeholder="~16文字"
            maxLength={16}
            onChange={(e) => setUserName(e.target.value)}
          />
          <TextInput
            name="user-id"
            content="ユーザーID"
            placeholder="英数字 4~16文字"
            maxLength={16}
            onChange={(e) => setStrId(e.target.value)}
          />
          <TextInput
            name="email"
            content="メールアドレス"
            placeholder="有効なメールアドレス"
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextInput
            type="password"
            name="password"
            content="パスワード"
            placeholder="英数字記号 6文字以上"
            autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextInput
            type="password"
            name="confirm-password"
            content="パスワード（再確認）"
            placeholder="英数字記号 6文字以上"
            autoComplete="new-password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div className="mt-5">
            <MyButton
              id="normal-login"
              onClick={onClickSignup}
              content="ユーザー登録"
            />
          </div>
        </form>
      </NoImageCard>
    </>
  );
}

Errors.propTypes = {
  errors: PropTypes.array,
};
