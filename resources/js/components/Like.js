import React, { useState } from 'react';
import { PropTypes } from 'prop-types';

const axios = require('axios');

export default function Like(props) {
  const item = props.item;
  const likes = props.item.likes;
  const viewerId = props.viewerId;

  const isAlreadyLiked = likes.find((like) => {
    return like.user_id == viewerId;
  });

  const [count, setCount] = useState(likes.length);
  const [isLiked, setIsLiked] = useState(isAlreadyLiked);

  // 既にいいね済みの場合は、自分（みている側）のユーザーID
  // 未いいねの場合はundefined

  function sendPostRequest(uuid) {
    axios
      .post('/api/like', {
        uuid: uuid,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleLike(e) {
    const uuid = e.target.dataset.uuid;
    const delta = isLiked ? -1 : +1;

    sendPostRequest(uuid);

    setIsLiked(!isLiked);
    setCount(count + delta);
  }

  return (
    <>
      <button
        type="button"
        className={
          isLiked ? 'likes btn btn-info' : 'likes btn btn-outline-info'
        }
        data-uuid={item.uuid}
        data-isliked={isLiked ? '1' : '0'}
        onClick={handleLike}
      >
        いいね
      </button>
      <p className="d-inline count" data-count={count}>
        {count}
      </p>
    </>
  );
}

Like.propTypes = {
  item: PropTypes.object,
  viewerId: PropTypes.number,
};
