import React from 'react';
import Subtitle from './Subtitle';
import Feed from './Feed';

function Post(props) {
  const post = props.post;
  return <Feed item={post} viewerId={props.viewerId} />;
}

function Comments(props) {
  const comments = props.comments.map((comment) => {
    return <Feed item={comment} viewerId={props.viewerId} key={comment.id} />;
  });

  return comments;
}

function PostWithComments(props) {
  const post = props.post;
  let comments = null;
  if (post.comments.length) {
    comments = <Comments comments={post.comments} viewerId={props.viewerId} />;
  }

  return (
    <>
      <Post post={post} viewerId={props.viewerId} />
      {comments}
    </>
  );
}

function Posts(props) {
  let posts = null;
  if (props.posts) {
    posts = props.posts.map((post) => {
      return (
        <PostWithComments post={post} viewerId={props.viewerId} key={post.id} />
      );
    });
  }

  return posts;
}

export default class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="row">
        <div className="col-12">
          <Subtitle subtitle="Home" />
          <Posts posts={this.props.posts} viewerId={this.props.viewerId} />
        </div>
      </div>
    );
  }
}
