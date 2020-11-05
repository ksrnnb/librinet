import React, { useContext, useEffect, useState } from 'react';
import Subtitle from '../components/Subtitle';
import { PostWithComments } from './Home';
import { PropsContext } from '../components/MyRouter';
import { DataContext, SetStateContext } from './App';
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

const axios = window.axios;

function RecommendBook(props: any) {
  const orderedBooks = props.orderedBooks;
  const genres = props.genres;
  const isRecommended = props.isRecommended;
  const onChange = props.onChange;
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
              props.setBookId(e.target.value);
            }}
          />
        </NoImageCard>
      </>
    );
  }
  return <></>;
}

function CommentForm(props: any) {
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
  const props: any = useContext(PropsContext);
  const data: any = useContext(DataContext);
  const params: any = data.params;
  const setState: any = useContext(SetStateContext);

  const [bookId, setBookId]: any = useState(null);
  const [item, setItem]: any = useState(null);
  const [isRecommended, setIsRecommended]: any = useState(false);
  const [message, setMessage]: any = useState('');
  const [errors, setErrors]: any = useState([]);

  useEffect(setup, []);

  function setup() {
    const item = props.location.state;

    item ? setItem(item) : getComment();

    function getComment() {
      const path = '/api/comment/' + props.match.params.uuid;
      axios
        .get(path)
        .then((response: any) => {
          const post = response.data;
          setItem(post);
        })
        .catch((error: any) => {
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
      const node: any = document.getElementById('select-book');

      if (node !== null) {
        setBookId(node.value);
      }
    }
  }

  function onSubmit() {
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
        .then((response: any) => {
          setState.params(response.data);
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
        <PostWithComments post={item} viewerId={viewerId} />
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
          onChange={(e: any) => setMessage(e.target.value)}
        />
      </>
    );
  } else {
    return <Errors errors={errors} />;
  }
}
