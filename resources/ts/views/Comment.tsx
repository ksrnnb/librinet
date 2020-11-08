import React, { useContext, useEffect, useState } from 'react';
import Subtitle from '../components/Subtitle';
import { PostWithComments, ModalWindow } from './Home';
import { PropsContext } from '../components/MyRouter';
import { DataContext, SetParamsContext } from './App';
import Errors from '../components/Errors';
import {
  MyButton,
  GroupedSelectBox,
  InputWithCheck,
  MyTextarea,
  NoImageCard,
  Caption,
} from '../components/Components';
import { MyLink } from '../functions/MyLink';
import {
  Response,
  Book,
  ErrorResponse,
  Data,
  RouterProps,
  Params,
  SetParams,
  Post as PostInterface,
  Comment as CommentInterface,
} from '../types/Interfaces';

const axios = window.axios;

interface RecommendProps {
  genres: {
    [id: string]: string;
  };

  orderedBooks: {
    [id: string]: Book[];
  };

  isRecommended: boolean;
  onChange: () => void;
  setBookId: (id: number) => void;
}

function RecommendBook(props: RecommendProps) {
  const { genres, isRecommended, onChange, orderedBooks, setBookId } = props;

  const hasBook = !Array.isArray(orderedBooks);

  if (hasBook) {
    return (
      <>
        <Caption content="おすすめ" />
        <NoImageCard>
          <InputWithCheck
            name="recommend"
            type="checkbox"
            checked={isRecommended}
            onChange={onChange}
            content="本もおすすめする"
          />
          <GroupedSelectBox
            genres={genres}
            orderedBooks={orderedBooks}
            disabled={!isRecommended}
            onChange={(e: any) => {
              setBookId(e.target.value);
            }}
          />
        </NoImageCard>
      </>
    );
  }
  return <></>;
}

interface FormProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: () => void;
}

function CommentForm(props: FormProps) {
  return (
    <>
      <MyTextarea
        name="message"
        onChange={props.onChange}
        content="コメントメッセージ"
      />
      <MyButton
        onClick={props.onClick}
        content="コメントする"
        withMargin={true}
      />
    </>
  );
}

export default function Comment() {
  const props: RouterProps = useContext(PropsContext);
  const data: Data = useContext(DataContext);
  const params: Params = data.params;
  const setParams: SetParams = useContext(SetParamsContext);

  const [bookId, setBookId] = useState<number | null>(null);
  const [item, setItem] = useState<PostInterface | CommentInterface | null>(
    null
  );
  const [isRecommended, setIsRecommended] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [errors, setErrors] = useState<string[]>([]);

  const [show, setShow] = useState<boolean>(false);
  const [isPost, setIsPost] = useState<boolean>(false);
  const [uuid, setUuid] = useState<string | null>(null);

  const handleClose = () => {
    setShow(false);
    setIsPost(false);
    setUuid(null);
  };

  const handleShow: (e: any) => void = (e: any) => {
    setShow(true);
    setIsPost(e.target.dataset.ispost);
    setUuid(e.target.dataset.uuid);
  };

  useEffect(setup, []);

  function setup() {
    const followingPosts = data.params.following_posts;

    let item = null;
    if (followingPosts) {
      item = followingPosts.filter(
        (post: any) => post.uuid === props.match.params.uuid
      )[0];
    }

    item ? setItem(item) : getComment();

    function getComment() {
      const path = '/api/comment/' + props.match.params.uuid;
      axios
        .get(path)
        .then((response: Response) => {
          const post = response.data;
          setItem(post);
        })
        .catch((error: ErrorResponse) => {
          if (error.response.status === 401) {
            // Unauthorized
            MyLink.home(props);
          } else if (error.response.status === 404) {
            // コメントがみつからないとき
            setErrors([error.response.data]);
          } else {
            MyLink.error(props);
          }
        });
    }
  }

  function onChangeRecommend() {
    const newIsRecommended = !isRecommended;
    setIsRecommended(newIsRecommended);

    if (newIsRecommended) {
      const node = document.getElementById('select-book') as HTMLInputElement;

      if (node != null) {
        setBookId(Number(node.value));
      }
    }
  }

  function onSubmit() {
    if (item == null) {
      alert('予期しないエラーが発生しました');
      return;
    }

    const userId = params.user.id;

    const paramsForPost = {
      book_id: bookId,
      post_id: item.id,
      message: message,
      user_id: userId,
    };

    const uuid = props.match.params.uuid;
    const path = '/api/comment/' + uuid;

    if (message === '') {
      setErrors(['コメントが入力されていません']);
    } else {
      axios
        .post(path, paramsForPost)
        .then((response: Response) => {
          setParams(response.data);
          MyLink.home(props);
        })
        .catch(() => {
          alert('予期しないエラーが発生しました');
        });
    }
  }

  if (item) {
    const user = params.user;
    const viewerId = user.id;
    return (
      <>
        <Subtitle subtitle="コメント" />
        <PostWithComments
          post={item as PostInterface}
          viewerId={viewerId}
          handleShow={handleShow}
        />
        <RecommendBook
          orderedBooks={user.ordered_books}
          genres={user.genres}
          isRecommended={isRecommended}
          setBookId={setBookId}
          onChange={onChangeRecommend}
        />
        <Errors errors={errors} />
        <CommentForm
          onClick={onSubmit}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setMessage(e.target.value)
          }
        />
        <ModalWindow
          show={show}
          handleClose={handleClose}
          uuid={uuid}
          isPost={isPost}
        />
      </>
    );
  } else {
    return <Errors errors={errors} />;
  }
}
