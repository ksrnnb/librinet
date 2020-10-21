import React from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

export function CommentIcon(props) {
  const linkToComment = props.linkToComment;
  const item = props.item;

  function Icon() {
    return (
      <svg
        className="icon"
        id="comment-icon"
        onClick={linkToComment}
        data-toggle="tooltip"
        data-placement="top"
        title="Tooltip on top"
        version="1.1"
        x="0px"
        y="0px"
        viewBox="0 0 32 32"
        style={{ enableBackground: 'new 0 0 32 32' }}
      >
        <g id="bubble">
          <path d="M16,7c-5.963,0-11,3.206-11,7c0,0.276,0.224,0.5,0.5,0.5S6,14.276,6,14c0-3.196,4.673-6,10-6
			c0.275,0,0.5-0.224,0.5-0.5S16.276,7,16,7z" />
          <path d="M16,2C7.163,2,0,7.373,0,14c0,4.127,2.779,7.766,7.008,9.926C7.008,23.953,7,23.971,7,24
			c0,1.793-1.339,3.723-1.928,4.736c0.001,0,0.002,0,0.002,0C5.027,28.846,5,28.967,5,29.094C5,29.594,5.405,30,5.906,30
			C6,30,6.165,29.975,6.161,29.986c3.125-0.512,6.069-3.383,6.753-4.215C13.913,25.918,14.943,26,16,26c8.835,0,16-5.373,16-12
			S24.836,2,16,2z M16,24c-0.917,0-1.858-0.07-2.796-0.207c-0.097-0.016-0.194-0.021-0.29-0.021c-0.594,0-1.163,0.264-1.546,0.73
			c-0.428,0.521-1.646,1.684-3.085,2.539c0.39-0.895,0.695-1.898,0.716-2.932c0.006-0.064,0.009-0.129,0.009-0.184
			c0-0.752-0.421-1.439-1.09-1.781C4.212,20.252,2,17.207,2,14C2,8.486,8.28,4,16,4c7.718,0,14,4.486,14,10S23.719,24,16,24z" />
        </g>
      </svg>
    );
  }

  const renderTooltip = (props) => (
    <Tooltip {...props}>
      コメント
    </Tooltip>
  );

  const isPost = 'comments' in item;
  const className = isPost ? "no-button" : "no-button invisible";
  const button = (
    <>
      <OverlayTrigger
        placement="top"
        overlay={renderTooltip}
      >
        <button className={className}>
          <Icon onClick={linkToComment} />
        </button>
      </OverlayTrigger>
    </>
  );

  return button;
}

export function BookIcon(props) {
  const uuid = props.uuid;
  const isLiked = props.isLiked;
  const sendLikeRequest = props.sendLikeRequest;

  const renderTooltip = (props) => (
    <Tooltip {...props}>
      読みたい！（いいね）
    </Tooltip>
  );

  function Icon(props) {
    return (
      <svg
        className="icon"
        id="book-icon"
        data-uuid={props.uuid}
        data-isliked={props.isliked}
        onClick={(e) => props.sendLikeRequest(e.target.dataset.uuid)}
        version="1.1"
        x="0px"
        y="0px"
        viewBox="0 0 512 512"
        enableBackground="new 0 0 512 512"
      >
        <path d="M464,64v416H80c-17.672,0-32-14.313-32-32s14.328-32,32-32h352V0H80C44.656,0,16,28.656,16,64v384c0,35.344,28.656,64,64,64
	h416V64H464z M80,128V96V32h320v352H80V128z M336,96H144V64h192V96z M272,160H144v-32h128V160z M208,224h-64v-32h64V224z" />
      </svg>
    );
  }

  return (
    <>
      <OverlayTrigger
        placement="top"
        overlay={renderTooltip}
      >
        <button className="no-button">
          <Icon
            uuid={uuid}
            isliked={isLiked ? '1' : 0}
            sendLikeRequest={sendLikeRequest} />
        </button>
      </OverlayTrigger>
    </>
  );
}

export function Trash(props) {
  const item = props.item;
  const viewerId = props.viewerId;
  const isPost = 'comments' in props.item;

  const renderTooltip = (props) => (
    <Tooltip {...props}>
      削除する
    </Tooltip>
  );


  function Icon(props) {
    return (
      <svg
        className="icon"
        id="trash-icon"
        name="delete"
        onClick={props.onClick}
        data-uuid={item.uuid}
        data-ispost={isPost}
        version="1.1"
        x="0px"
        y="0px"
        viewBox="0 0 100 100"
        enableBackground="new 0 0 100 100">
        <path d="M75.7,19.5H61.6C60.7,13.8,55.9,9.4,50,9.4c-5.9,0-10.8,4.4-11.6,10.1H24.5c-2.7,0-4.9,2.2-4.9,4.9v5c0,2.5,1.8,4.5,4.2,4.8  v48.8c0,3.6,2.9,6.5,6.5,6.5h39.7c3.6,0,6.5-2.9,6.5-6.5V34.3c2.4-0.4,4.2-2.4,4.2-4.8v-5C80.6,21.7,78.4,19.5,75.7,19.5z M50,13.1  c3.9,0,7.1,2.7,7.8,6.4H42.1C42.9,15.9,46.1,13.1,50,13.1z M72.7,83.1c0,1.5-1.2,2.8-2.8,2.8H30.2c-1.5,0-2.8-1.2-2.8-2.8V34.4h45.2  V83.1z M76.9,29.4c0,0.7-0.5,1.2-1.2,1.2H24.5c-0.7,0-1.2-0.5-1.2-1.2v-5c0-0.7,0.5-1.2,1.2-1.2h51.1c0.7,0,1.2,0.5,1.2,1.2V29.4z   M35.7,76.3V44.7c0-1,0.8-1.8,1.8-1.8c1,0,1.8,0.8,1.8,1.8v31.6c0,1-0.8,1.8-1.8,1.8C36.5,78.2,35.7,77.3,35.7,76.3z M48.4,76.3  V44.7c0-1,0.8-1.8,1.8-1.8c1,0,1.8,0.8,1.8,1.8v31.6c0,1-0.8,1.8-1.8,1.8C49.2,78.2,48.4,77.3,48.4,76.3z M61.1,76.3V44.7  c0-1,0.8-1.8,1.8-1.8c1,0,1.8,0.8,1.8,1.8v31.6c0,1-0.8,1.8-1.8,1.8C62,78.2,61.1,77.3,61.1,76.3z" />
      </svg>
    );
  }

  const className = item.user_id == viewerId ? "no-button" : "no-button invisible";

  return (
    <>
      <OverlayTrigger
        placement="top"
        overlay={renderTooltip}
      >
        <button className={className}>
          <Icon onClick={props.onClick} />
        </button>
      </OverlayTrigger>
    </>
  );
}