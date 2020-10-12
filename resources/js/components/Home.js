import React, { useContext } from 'react';
import Subtitle from './Subtitle';
import Feed from './Feed';
import { DataContext } from './App';

function Post(props) {
  const post = props.post;
  return (
    <Feed
      item={post}
      viewerId={props.viewerId}
      onClickDelete={props.onClickDelete}
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

function PostWithComments(props) {
  const post = props.post;
  let comments = null;
  if (post.comments.length) {
    comments = (
      <Comments
        comments={post.comments}
        viewerId={props.viewerId}
        onClickDelete={props.onClickDelete}
      />
    );
  }

  return (
    <>
      <Post
        post={post}
        viewerId={props.viewerId}
        onClickDelete={props.onClickDelete}
      />
      {comments}
    </>
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
          key={post.id}
          onClickDelete={props.onClickDelete}
        />
      );
    });

    return posts;
  } else {
    return null;
  }
}

export default function Home(props) {
  const data = useContext(DataContext);
  const posts = data.params.following_posts;
  const user = data.params.user;

  return (
    <div className="row">
      <div className="col-12">
        <Subtitle subtitle="Home" />
        <Posts
          posts={posts}
          viewerId={user.id}
          onClickDelete={props.onClickDelete}
        />
      </div>
    </div>
  );
}
