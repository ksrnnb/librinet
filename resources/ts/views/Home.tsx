import React, { useContext, useEffect, useState } from 'react';
import Subtitle from '../components/Subtitle';
import Feed from '../components/Feed';
import { DataContext, SetParamsContext } from './App';
import { PropsContext } from '../components/MyRouter';
import { MyLink } from '../functions/MyLink';
import { Modal, Button } from 'react-bootstrap';
import {
  User,
  Data,
  RouterProps,
  SetParams,
  Post as PostInterface,
  Comment as CommentInterface,
  Post,
} from '../types/Interfaces';

const axios = window.axios;

interface PostProps {
  post: PostInterface;
  viewerId: number;
  onClickDelete: (e: any) => void;
  linkToComment: (props: RouterProps) => void;
}

function Post(props: PostProps): any {
  const { post, viewerId, onClickDelete, linkToComment } = props;

  return (
    <Feed
      item={post}
      viewerId={viewerId}
      onClickDelete={onClickDelete}
      linkToComment={linkToComment}
    />
  );
}

interface CommentsProps {
  comments: CommentInterface[];
  viewerId: number;
  onClickDelete: (e: any) => void;
}

function Comments(props: CommentsProps) {
  const { comments, viewerId, onClickDelete } = props;

  const commentsJsx = comments.map((comment: CommentInterface) => {
    return (
      <Feed
        item={comment}
        viewerId={viewerId}
        key={comment.id}
        onClickDelete={onClickDelete}
      />
    );
  });

  return <>{commentsJsx}</>;
}

interface PostWithCommentsProps {
  post: PostInterface;
  viewerId: number;
  handleShow: (e: any) => void;
}

export function PostWithComments(props: PostWithCommentsProps) {
  const routerProps = useContext(PropsContext);
  const { post, handleShow, viewerId } = props;

  return (
    <div className="feed-chunk shadow mb-5">
      <Post
        post={post}
        viewerId={viewerId}
        onClickDelete={handleShow}
        linkToComment={() => MyLink.comment(routerProps, post)}
      />
      {post.comments.length > 0 && (
        <Comments
          comments={post.comments}
          viewerId={viewerId}
          onClickDelete={handleShow}
        />
      )}
    </div>
  );
}

interface PostsProps {
  posts: PostInterface[];
  viewerId: number;
  handleShow: (e: any) => void;
}

export function Posts(props: PostsProps) {
  const { posts, viewerId, handleShow } = props;
  if (posts == null) {
    return <></>;
  }

  const postsIterator = Object.values(posts);

  const postsJsx = postsIterator.map((post: PostInterface) => {
    return (
      <PostWithComments
        post={post}
        viewerId={viewerId}
        handleShow={handleShow}
        key={post.id}
      />
    );
  });

  return <>{postsJsx}</>;
}

interface ModalProps {
  show: boolean;
  handleClose: () => void;
  uuid: string | null;
  isPost: string | boolean;
}

export function ModalWindow(props: ModalProps) {
  const { show, handleClose, uuid, isPost } = props;
  const data: Data = useContext(DataContext);
  const setParams: SetParams = useContext(SetParamsContext);
  const routerProps: RouterProps = useContext(PropsContext);

  const deleteFeed = () => {
    // isPostは文字列できているので注意。
    const path = isPost === 'true' ? '/api/post' : '/api/comment';

    axios
      .delete(path, {
        data: { uuid: uuid },
      })
      .then((response: any) => {
        const following_posts = response.data;
        const params = Object.assign({}, data.params);
        params.following_posts = following_posts;
        setParams(params);
        handleClose();

        MyLink.home(routerProps);
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
  const data: Data = useContext(DataContext);
  const props: RouterProps = useContext(PropsContext);
  const user: User = data.params.user;
  const [show, setShow] = useState<boolean>(false);
  const [isPost, setIsPost] = useState<boolean>(false);
  const [uuid, setUuid] = useState<string | null>(null);

  const handleClose = () => {
    setShow(false);
    setUuid(null);
  };

  const handleShow: (e: any) => void = (e: any) => {
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
