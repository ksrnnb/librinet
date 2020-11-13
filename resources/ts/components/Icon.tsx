import React from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

export function CommentIcon(props: any): any {
  const linkToComment = props.linkToComment;
  const item = props.item;

  function Icon() {
    return (
      <svg
        className="icon comment-icon"
        version="1.1"
        x="0px"
        y="0px"
        viewBox="0 0 32 32"
        enableBackground="new 0 0 32 32"
      >
        <g id="bubble">
          <path
            d="M16,7c-5.963,0-11,3.206-11,7c0,0.276,0.224,0.5,0.5,0.5S6,14.276,6,14c0-3.196,4.673-6,10-6
			c0.275,0,0.5-0.224,0.5-0.5S16.276,7,16,7z"
          />
          <path
            d="M16,2C7.163,2,0,7.373,0,14c0,4.127,2.779,7.766,7.008,9.926C7.008,23.953,7,23.971,7,24
			c0,1.793-1.339,3.723-1.928,4.736c0.001,0,0.002,0,0.002,0C5.027,28.846,5,28.967,5,29.094C5,29.594,5.405,30,5.906,30
			C6,30,6.165,29.975,6.161,29.986c3.125-0.512,6.069-3.383,6.753-4.215C13.913,25.918,14.943,26,16,26c8.835,0,16-5.373,16-12
			S24.836,2,16,2z M16,24c-0.917,0-1.858-0.07-2.796-0.207c-0.097-0.016-0.194-0.021-0.29-0.021c-0.594,0-1.163,0.264-1.546,0.73
			c-0.428,0.521-1.646,1.684-3.085,2.539c0.39-0.895,0.695-1.898,0.716-2.932c0.006-0.064,0.009-0.129,0.009-0.184
			c0-0.752-0.421-1.439-1.09-1.781C4.212,20.252,2,17.207,2,14C2,8.486,8.28,4,16,4c7.718,0,14,4.486,14,10S23.719,24,16,24z"
          />
        </g>
      </svg>
    );
  }

  const renderTooltip = (props: any) => <Tooltip {...props}>コメント</Tooltip>;

  const isPost = 'comments' in item;
  const className = isPost ? 'no-button comment-btn' : 'no-button invisible';
  const button = (
    <>
      <OverlayTrigger placement="top" overlay={renderTooltip}>
        <button className={className} onClick={linkToComment}>
          <Icon />
        </button>
      </OverlayTrigger>
    </>
  );

  return button;
}

export function LikeIcon(props: any) {
  const isLiked = props.isLiked;
  const sendLikeRequest = props.sendLikeRequest;

  const renderTooltip = (props: any) => (
    <Tooltip {...props}>いいね（読みたい！）</Tooltip>
  );

  function Icon() {
    return (
      <svg
        className="icon like-icon"
        version="1.1"
        x="0px"
        y="0px"
        viewBox="0 0 512 512"
        enableBackground="new 0 0 512 512"
      >
        <path
          d="M464,64v416H80c-17.672,0-32-14.313-32-32s14.328-32,32-32h352V0H80C44.656,0,16,28.656,16,64v384c0,35.344,28.656,64,64,64
	h416V64H464z M80,128V96V32h320v352H80V128z M336,96H144V64h192V96z M272,160H144v-32h128V160z M208,224h-64v-32h64V224z"
        />
      </svg>
    );
  }

  return (
    <>
      <OverlayTrigger placement="top" overlay={renderTooltip}>
        <button
          className="no-button like-btn"
          data-isliked={isLiked}
          onClick={sendLikeRequest}
        >
          <Icon />
        </button>
      </OverlayTrigger>
    </>
  );
}

export function Trash(props: any) {
  const item = props.item;
  const viewerId = props.viewerId;
  const isPost = !('post_id' in props.item);

  const renderTooltip = (props: any) => <Tooltip {...props}>削除する</Tooltip>;

  function Icon() {
    return (
      <svg
        className="icon trash-icon"
        name="delete"
        version="1.1"
        x="0px"
        y="0px"
        viewBox="0 0 100 100"
        enableBackground="new 0 0 100 100"
      >
        <path d="M75.7,19.5H61.6C60.7,13.8,55.9,9.4,50,9.4c-5.9,0-10.8,4.4-11.6,10.1H24.5c-2.7,0-4.9,2.2-4.9,4.9v5c0,2.5,1.8,4.5,4.2,4.8  v48.8c0,3.6,2.9,6.5,6.5,6.5h39.7c3.6,0,6.5-2.9,6.5-6.5V34.3c2.4-0.4,4.2-2.4,4.2-4.8v-5C80.6,21.7,78.4,19.5,75.7,19.5z M50,13.1  c3.9,0,7.1,2.7,7.8,6.4H42.1C42.9,15.9,46.1,13.1,50,13.1z M72.7,83.1c0,1.5-1.2,2.8-2.8,2.8H30.2c-1.5,0-2.8-1.2-2.8-2.8V34.4h45.2  V83.1z M76.9,29.4c0,0.7-0.5,1.2-1.2,1.2H24.5c-0.7,0-1.2-0.5-1.2-1.2v-5c0-0.7,0.5-1.2,1.2-1.2h51.1c0.7,0,1.2,0.5,1.2,1.2V29.4z   M35.7,76.3V44.7c0-1,0.8-1.8,1.8-1.8c1,0,1.8,0.8,1.8,1.8v31.6c0,1-0.8,1.8-1.8,1.8C36.5,78.2,35.7,77.3,35.7,76.3z M48.4,76.3  V44.7c0-1,0.8-1.8,1.8-1.8c1,0,1.8,0.8,1.8,1.8v31.6c0,1-0.8,1.8-1.8,1.8C49.2,78.2,48.4,77.3,48.4,76.3z M61.1,76.3V44.7  c0-1,0.8-1.8,1.8-1.8c1,0,1.8,0.8,1.8,1.8v31.6c0,1-0.8,1.8-1.8,1.8C62,78.2,61.1,77.3,61.1,76.3z" />
      </svg>
    );
  }

  const className =
    item.user_id == viewerId
      ? 'no-button trash-btn'
      : 'no-button invisible trash-btn';

  return (
    <>
      <OverlayTrigger placement="top" overlay={renderTooltip}>
        <button
          className={className}
          onClick={props.onClick}
          data-uuid={item.uuid}
          data-ispost={isPost}
        >
          <Icon />
        </button>
      </OverlayTrigger>
    </>
  );
}

export function GearIcon(props: any) {
  const dropdownMenu = props.dropdownMenu;

  const icon = (
    <svg
      version="1.1"
      fill="#000"
      className="icon gear-icon"
      x="0px"
      y="0px"
      viewBox="0 0 100 100"
      enableBackground="new 0 0 100 100"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M95.525,52.728c-5.582-1.496-6.847-14.585-2.268-17.228  c1.501-0.87,2.665-2.104,3.434-3.527c-1.191-4.343-5.255-10.6-7.548-13.383c-1.676-0.078-3.39,0.305-4.95,1.206  c-4.995,2.886-15.321-4.833-13.783-10.578c0.481-1.795,0.227-3.972-0.165-5.244c-2.839-1.468-9.562-3.443-14.555-3.932  c-1.076,0.783-2.308,2.676-2.788,4.483c-1.629,6.075-14.52,6.958-17.285,2.17c-0.923-1.6-2.623-3.09-3.798-3.58  c-3.23,0.979-10.249,5.048-13.088,7.397c0.196,1.664,0.234,3.597,1.188,5.247c2.763,4.789-4.72,15.438-10.629,13.855  c-1.944-0.52-3.984-0.372-5.648,0.313C2.271,32.963,0.196,40.97,0,44.2c0.392,0.881,2.729,2.428,4.598,2.928  c8.043,2.156,8.106,13.951,2.279,17.315c-1.646,0.951-3.056,2.271-3.643,3.936c0.979,3.132,4.913,10.018,7.458,12.955  c1.664,0.195,3.597-0.232,5.248-1.187c5.204-3.007,15.612,4.064,13.853,10.631c-0.457,1.709-0.204,3.507,0.089,5.27  c3.916,1.664,11,4.005,14.916,3.907c1.272-1.175,2.057-2.812,2.504-4.483c1.54-5.748,14.253-7.582,17.257-2.378  c0.839,1.455,2.014,2.836,3.384,3.619c4.111-1.175,11.338-5.219,13.788-7.764c0.096-1.859-0.604-3.412-1.474-4.922  c-3.247-5.619,4.338-15.458,10.575-13.786c1.708,0.456,3.568,0.302,5.135-0.089c1.37-3.427,3.642-9.549,4.032-14.639  C98.629,53.947,97.329,53.212,95.525,52.728z M76.521,56.525c-3.807,14.217-18.417,22.651-32.632,18.843  c-14.213-3.81-22.647-18.423-18.839-32.639c3.808-14.216,18.418-22.651,32.631-18.842C71.895,27.696,80.33,42.307,76.521,56.525z"
      />
    </svg>
  );

  return (
    <div className="dropdown">
      <button
        className="no-button dropdown-toggle"
        type="button"
        id="dropdownMenu2"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        {icon}
      </button>
      <div
        className="dropdown-menu dropdown-menu-right"
        aria-labelledby="dropdownMenu2"
      >
        {dropdownMenu}
      </div>
    </div>
  );
}

export function BookIcon() {
  return (
    <svg
      className="book-icon"
      version="1.1"
      x="0px"
      y="0px"
      viewBox="0 0 512 512"
      enableBackground="new 0 0 512 512"
    >
      <path
        d="M464,64v416H80c-17.672,0-32-14.313-32-32s14.328-32,32-32h352V0H80C44.656,0,16,28.656,16,64v384c0,35.344,28.656,64,64,64
    h416V64H464z M80,128V96V32h320v352H80V128z M336,96H144V64h192V96z M272,160H144v-32h128V160z M208,224h-64v-32h64V224z"
      />
    </svg>
  );
}
