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

  function sendLikeRequest(uuid) {
    // さきに値を変える
    const delta = isLiked ? -1 : +1;
    setIsLiked(!isLiked);
    setCount(count + delta);

    axios
      .post('/api/like', {
        uuid: uuid,
      })
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
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
        onClick={(e) => sendLikeRequest(e.target.dataset.uuid)}
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
