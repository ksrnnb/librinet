import { DataContext, SetParamsContext } from './App';
import { PropsContext } from '../components/MyRouter';
import Subtitle from '../components/Subtitle';
import Errors from '../components/Errors';
import { TextInput, MyButton, NoImageCard } from '../components/Components';
import React, {
  useContext,
  useEffect,
  useState,
  ChangeEvent,
  KeyboardEvent,
} from 'react';
import { MyLink } from '../functions/MyLink';
import { Response, ErrorResponse } from '../types/Interfaces';

const axios = window.axios;

export default function Signup() {
  const [userName, setUserName] = useState<string>('');
  const [strId, setStrId] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errors, setErrors] = useState<string[]>([]);
  const props = useContext(PropsContext);
  const data = useContext(DataContext);
  const setParams: any = useContext(SetParamsContext);

  useEffect(() => {
    data.params.user && MyLink.home(props);
  }, []);

  function pressEnter(e: KeyboardEvent<HTMLInputElement>) {
    // Enterキーを押した場合、送信する。
    if (e.keyCode === 13) {
      register();
    }
  }

  function register() {
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
            .then((response: Response) => {
              const params = response.data;
              setParams(params);
              MyLink.home(props);
            })
            .catch((error: ErrorResponse) => {
              window.scroll(0, 0);
              // validation errorの場合
              if (error.response.status === 422) {
                const errors: string[] = Object.values(
                  error.response.data.errors
                );
                setErrors(errors);
              } else {
                MyLink.error(props);
              }
            });
        })
        .catch(() => {
          alert('ユーザー登録時にエラーが発生しました');
        });
    }
  }

  function validation() {
    const newErrors = [];

    // \x20: 半角スペース, \u3000: 全角スペース
    const isUserName = /^[^\x20\u3000]{1,16}$/;
    const isUserId = /^\w{4,16}$/;
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
      window.scroll(0, 0);
      setErrors(newErrors);
      return false;
    }

    return true;
  }

  return (
    <>
      <Subtitle subtitle="ユーザーの登録" />
      <NoImageCard margin="mb-5">
        <Errors errors={errors} />
        <form onSubmit={register}>
          <TextInput
            name="user-name"
            content="ユーザー名"
            placeholder="~16文字"
            maxLength={16}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setUserName(e.target.value)
            }
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => pressEnter(e)}
          />
          <TextInput
            name="user-id"
            content="ユーザーID"
            placeholder="英数字 4~16文字"
            maxLength={16}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setStrId(e.target.value)
            }
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => pressEnter(e)}
          />
          <TextInput
            name="email"
            content="メールアドレス"
            placeholder="****@****"
            autoComplete="email"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => pressEnter(e)}
          />
          <TextInput
            type="password"
            name="password"
            content="パスワード"
            placeholder="英数字記号 6文字以上"
            autoComplete="new-password"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => pressEnter(e)}
          />
          <TextInput
            type="password"
            name="confirm-password"
            content="パスワード（再確認）"
            placeholder="英数字記号 6文字以上"
            autoComplete="new-password"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setConfirmPassword(e.target.value)
            }
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => pressEnter(e)}
          />
          <div className="mt-5">
            <MyButton
              id="normal-login"
              onClick={register}
              content="ユーザー登録"
            />
          </div>
        </form>
      </NoImageCard>
    </>
  );
}
