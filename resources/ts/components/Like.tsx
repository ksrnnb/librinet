import React, { useContext, useState } from 'react';
import { LikeIcon } from './Icon';
import { DataContext, SetStateContext } from '../views/App';

const axios = window.axios;

export default function Like(props: any) {
  const item: any = props.item;
  const likes: any = props.item.likes;
  const viewerId: any = props.viewerId;
  const data: any = useContext(DataContext);
  const setState: any = useContext(SetStateContext);

  const isAlreadyLiked = likes.some((like: any) => {
    return like.user_id == viewerId;
  });

  const [count, setCount] = useState(likes.length);
  const [isLiked, setIsLiked] = useState(isAlreadyLiked);

  // params.following_postのlikeを更新する
  function updateLike() {
    // post_idを持ってなければPost、持ってたらコメント！
    const isPost = item.post_id == null;
    const likes = item.likes;
    let newLikes;

    if (isLiked) {
      newLikes = likes.filter((like: any) => {
        return like.user_id !== viewerId;
      });
    } else {
      // ダミーのlikeを作成
      const like = {
        id: 0,
        user_id: viewerId,
        post_id: isPost ? item.id : item.post_id,
        comemnt_id: isPost ? null : item.id,
      };

      likes.push(like);
      newLikes = likes.slice();
    }

    const posts = data.params.following_posts;
    const postId = item.post_id || item.id;

    // postsがオブジェクトなので、いったんキーの配列をつくって、
    // PostのIDが一致するIndexを取得
    const pIndex: any = Object.keys(posts).find((key) => {
      return posts[key].id == postId;
    });

    // postの場合はそのまま更新するだけ
    if (isPost) {
      posts[pIndex].likes = newLikes;
      // commentの場合はindex取得して、更新する。
    } else {
      const comments = posts[pIndex].comments;

      const cIndex = comments.findIndex((comment: any) => {
        return comment.id == item.id;
      });

      posts[pIndex].comments[cIndex].likes = newLikes;
    }

    // paramsを取得してstateを更新
    const params = data.params;
    params.following_posts = posts;
    setState.params(params);
  }

  function sendLikeRequest() {
    // さきに値を変える
    const delta = isLiked ? -1 : +1;
    setIsLiked(!isLiked);
    setCount(count + delta);

    updateLike();

    axios
      .post('/api/like', {
        uuid: item.uuid,
      })
      .catch(() => {
        alert('いいねできませんでした');
      });
  }

  return (
    <div>
      <LikeIcon isLiked={isLiked} sendLikeRequest={sendLikeRequest} />
      <p className="d-inline count pl-1" data-count={count}>
        {count}
      </p>
    </div>
  );
}
