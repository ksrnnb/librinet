import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { LikeIcon } from './Icon';

const axios = require('axios');

export default function Like(props) {
  const item = props.item;
  const likes = props.item.likes;
  const viewerId = props.viewerId;

  const isAlreadyLiked = likes.some((like) => {
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
      .then(() => { })
      .catch((error) => {
        console.log(error);
      });
  }

  console.log('--Like---');
  console.log(isLiked);

  return (
    <div>
      <LikeIcon
        uuid={item.uuid}
        isLiked={isLiked}
        sendLikeRequest={sendLikeRequest}
      />
      <p className="d-inline count pl-1" data-count={count}>
        {count}
      </p>
    </div>
  );
}

Like.propTypes = {
  item: PropTypes.object,
  viewerId: PropTypes.number,
};
