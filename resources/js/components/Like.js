import React from 'react';
const axios = require('axios');

export default class Like extends React.Component {
  constructor(props) {
    super(props);

    const likes = this.props.item.likes;
    const viewerId = this.props.viewerId;
    const count = likes.length;

    // 既にいいね済みの場合は、自分（みている側）のユーザーID
    // 未いいねの場合はundefined
    const isLiked = likes.find((like) => {
      return like.user_id == viewerId;
    });

    this.state = {
      count: count,
      isLiked: isLiked,
    };

    this.handleLike = this.handleLike.bind(this);
  }

  sendPostRequest(uuid) {
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

  handleLike(e) {
    const uuid = e.target.dataset.uuid;
    const isLiked = this.state.isLiked;
    const delta = isLiked ? -1 : +1;
    const count = this.state.count + delta;

    this.sendPostRequest(uuid);

    this.setState({
      isLiked: !isLiked,
      count: count,
    });
  }

  render() {
    const item = this.props.item;
    const isLiked = this.state.isLiked;

    let button = null;
    if (isLiked) {
      button = (
        <button
          type="button"
          className="likes btn btn-info"
          data-uuid={item.uuid}
          data-isliked="1"
          onClick={this.handleLike}
        >
          いいね
        </button>
      );
    } else {
      button = (
        <button
          type="button"
          className="likes btn btn-outline-info"
          data-uuid={item.uuid}
          data-isliked="0"
          onClick={this.handleLike}
        >
          いいね
        </button>
      );
    }

    return (
      <>
        {button}
        <p className="d-inline count" data-count={this.state.count}>
          {this.state.count}
        </p>
      </>
    );
  }
}
