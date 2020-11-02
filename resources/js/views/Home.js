import React, { useContext, useEffect, useState } from 'react';
import Subtitle from '../components/Subtitle';
import Feed from '../components/Feed';
import { DataContext, SetStateContext } from './App';
import { PropTypes } from 'prop-types';
import { PropsContext } from '../components/MyRouter';
import { MyLink } from '../functions/MyLink';
import { Modal, Button } from 'react-bootstrap';

const axios = window.axios;

function Post(props) {
  const post = props.post;
  return (
    <Feed
      item={post}
      viewerId={props.viewerId}
      onClickDelete={props.onClickDelete}
      linkToComment={props.linkToComment}
    />
  );
}

function Comments(props) {
  const comments = props.comments.map((comment) => {
    return (
      <Feed
        item={comment}
        viewerId={props.viewerId}
        key={comment.id}
        onClickDelete={props.onClickDelete}
      />
    );
  });

  return comments;
}

export function PostWithComments(props) {
  const main_props = useContext(PropsContext);
  const { post, handleShow } = props;

  return (
    <div className="feed-chunk shadow mb-5">
      <Post
        post={post}
        viewerId={props.viewerId}
        onClickDelete={handleShow}
        linkToComment={() => MyLink.comment(main_props, post)}
      />
      {post.comments.length > 0 && (
        <Comments
          comments={post.comments}
          viewerId={props.viewerId}
          onClickDelete={handleShow}
        />
      )}
    </div>
  );
}

function Posts(props) {
  if (props.posts) {
    const postsIterator = Object.values(props.posts);
    const posts = postsIterator.map((post) => {
      return (
        <PostWithComments
          post={post}
          viewerId={props.viewerId}
          handleShow={props.handleShow}
          key={post.id}
        />
      );
    });

    return posts;
  } else {
    return null;
  }
}

function ModalWindow(props) {
  const { show, handleClose, uuid, isPost } = props;
  const data = useContext(DataContext);
  const setState = useContext(SetStateContext);
  const main_props = useContext(PropsContext);

  const deleteFeed = () => {
    // isPostは文字列できているので注意。
    const path = isPost === 'true' ? '/api/post' : '/api/comment';

    axios
      .delete(path, {
        data: { uuid: uuid },
      })
      .then((response) => {
        const following_posts = response.data;
        const params = data.params;
        params.following_posts = following_posts;
        setState.params(params);
        handleClose();

        MyLink.home(main_props);
      })
      .catch(() => {
        alert('投稿を削除できませんでした');
      });
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>投稿の削除</Modal.Title>
        </Modal.Header>
        <Modal.Body>選択した投稿を削除しますか？</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            キャンセル
          </Button>
          <Button variant="primary" onClick={deleteFeed}>
            はい
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default function Home() {
  const data = useContext(DataContext);
  const props = useContext(PropsContext);
  const user = data.params.user;
  const [show, setShow] = useState(false);
  const [isPost, setIsPost] = useState(null);
  const [uuid, setUuid] = useState(null);

  const handleClose = () => {
    setShow(false);
    setIsPost(null);
    setUuid(null);
  };

  const handleShow = (e) => {
    setShow(true);
    setIsPost(e.target.dataset.ispost);
    setUuid(e.target.dataset.uuid);
  };

  // 未ログインの場合はTopへ
  useEffect(() => {
    if (typeof user === 'undefined') {
      MyLink.top(props);
    }
  }, []);

  if (user) {
    const posts = data.params.following_posts;

    return (
      <div className="row">
        <div className="col-12">
          <Subtitle subtitle="ホーム" />
          <Posts posts={posts} viewerId={user.id} handleShow={handleShow} />

          <ModalWindow
            show={show}
            handleClose={handleClose}
            uuid={uuid}
            isPost={isPost}
          />
        </div>
      </div>
    );
  } else {
    return <></>;
  }
}

Posts.propTypes = {
  posts: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  viewerId: PropTypes.number,
};

PostWithComments.propTypes = {
  post: PropTypes.object,
  handleShow: PropTypes.func,
  viewerId: PropTypes.number,
};

ModalWindow.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  uuid: PropTypes.string,
  isPost: PropTypes.string,
};

Post.propTypes = {
  post: PropTypes.object,
  viewerId: PropTypes.number,
  onClickDelete: PropTypes.func,
  linkToComment: PropTypes.func,
};
