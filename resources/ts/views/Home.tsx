import React, { useContext, useEffect, useState } from 'react';
import Subtitle from '../components/Subtitle';
import Feed from '../components/Feed';
import { DataContext, SetStateContext } from './App';
import { PropsContext } from '../components/MyRouter';
import { MyLink } from '../functions/MyLink';
import { Modal, Button } from 'react-bootstrap';

const axios = window.axios;

function Post(props: any): any {
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

function Comments(props: any): any {
  const comments = props.comments.map((comment: any) => {
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

export function PostWithComments(props: any): any {
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

function Posts(props: any): any {
  if (props.posts) {
    const postsIterator = Object.values(props.posts);
    const posts = postsIterator.map((post: any) => {
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

function ModalWindow(props: any) {
  const { show, handleClose, uuid, isPost } = props;
  const data: any = useContext(DataContext);
  const setState: any = useContext(SetStateContext);
  const main_props: any = useContext(PropsContext);

  const deleteFeed = () => {
    // isPostは文字列できているので注意。
    const path = isPost === 'true' ? '/api/post' : '/api/comment';

    axios
      .delete(path, {
        data: { uuid: uuid },
      })
      .then((response: any) => {
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
  const data: any = useContext(DataContext);
  const props: any = useContext(PropsContext);
  const user: any = data.params.user;
  const [show, setShow]: any = useState(false);
  const [isPost, setIsPost]: any = useState(null);
  const [uuid, setUuid]: any = useState(null);

  const handleClose = () => {
    setShow(false);
    setIsPost(null);
    setUuid(null);
  };

  const handleShow: any = (e: any) => {
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
