import React from 'react';
import ReactDOM from 'react-dom';
const axios = require('axios');

const likeButtons = [...document.getElementsByClassName('likes')];

likeButtons.forEach((likeButton) => {
  likeButton.addEventListener('click', (e) => {
    const isAlreadyLiked = e.target.dataset.isliked == '1'; // string "0" or "1"

    if (isAlreadyLiked) {
      unlike(e);
    } else {
      like(e);
    }
  });
});

function sendPostRequest(like) {
  const uuid = like.parentNode.dataset.uuid;

  // Laravelの場合、自動でX-XSRF-TOKENヘッダを送信しているらしい。
  // resources/js/bootstrap.jsに書いている。
  axios
    .post('/like', {
      uuid: uuid,
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
}

function unlike(e) {
  const like = e.target;
  like.dataset.isliked = '0';
  like.classList.remove('btn-info');
  like.classList.add('btn-outline-info');

  // Buttonの隣の要素がいいね数
  const count = like.nextElementSibling;
  count.dataset.count = Number(count.dataset.count) - 1;
  count.innerHTML = count.dataset.count;

  sendPostRequest(like);
}

function like(e) {
  const like = e.target;
  like.dataset.isliked = '1';
  like.classList.remove('btn-outline-info');
  like.classList.add('btn-info');

  // Buttonの隣の要素がいいね数
  const count = like.nextElementSibling;
  count.dataset.count = Number(count.dataset.count) + 1;
  count.innerHTML = count.dataset.count;

  sendPostRequest(like);
}

class Like extends React.Component {
  render() {
    return '';
  }
}

if (document.getElementById('like-react')) {
  ReactDOM.render(<Like />, document.getElementById('like-react'));
}
