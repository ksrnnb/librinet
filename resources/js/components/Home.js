import React, { useContext } from 'react';
import Subtitle from './Subtitle';
import Feed from './Feed';
import { DataContext, SetStateContext } from './App';
import { PropTypes } from 'prop-types';
import { PropsContext } from './Pages';

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
  const data = useContext(DataContext);
  const pages_props = useContext(PropsContext);
  const setState = useContext(SetStateContext);
  const post = props.post;

  function onClickDelete(e) {
    const uuid = e.target.dataset.uuid;
    // 文字列の'false'はtrueになってしまうので以下のように判定
    const isPost = e.target.dataset.ispost === 'true' ? true : false;

    const path = isPost ? '/api/post' : '/api/comment';

    // TODO: 本当に消しますか？って出したい
    axios
      .delete(path, {
        data: { uuid: uuid },
      })
      .then((response) => {
        const following_posts = response.data;
        const params = data.params;
        params.following_posts = following_posts;

        setState.params(params);
        pages_props.history.push('/home');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function linkToComment() {
    const url = '/comment/' + post.uuid;
    window.scroll(0, 0);
    pages_props.history.push({
      pathname: url,
      state: post,
    });
  }

  return (
    <div className="feed-chunk shadow mb-5">
      <Post
        post={post}
        viewerId={props.viewerId}
        onClickDelete={onClickDelete}
        linkToComment={linkToComment}
      />
      {post.comments.length > 0 && (
        <Comments
          comments={post.comments}
          viewerId={props.viewerId}
          onClickDelete={onClickDelete}
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
        <PostWithComments post={post} viewerId={props.viewerId} key={post.id} />
      );
    });

    return posts;
  } else {
    return null;
  }
}

export default function Home() {
  const data = useContext(DataContext);
  const user = data.params.user;

  if (user) {
    const posts = data.params.following_posts;

    return (
      <div className="row">
        <div className="col-12">
          <Subtitle subtitle="ホーム" />
          <Posts posts={posts} viewerId={user.id} />
        </div>
      </div>
    );
  } else {
    // TODO 未ログインの処理
    return (
      <>
        <div className="row">
          <div className="col-12">
            <Subtitle subtitle="ホーム" />
            <p className="text-danger">ログインしていません</p>
          </div>
        </div>
      </>
    );
  }
}

Posts.propTypes = {
  posts: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  viewerId: PropTypes.number,
};

PostWithComments.propTypes = {
  post: PropTypes.object,
  viewerId: PropTypes.number,
};

Post.propTypes = {
  post: PropTypes.object,
  viewerId: PropTypes.number,
  onClickDelete: PropTypes.func,
  linkToComment: PropTypes.func,
};
