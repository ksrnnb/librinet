import React, { useContext } from 'react';
import Subtitle from './Subtitle';
import Feed from './Feed';
import { DataContext } from './App';
import { PropTypes } from 'prop-types';

const axios = window.axios;

function Post(props) {
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
        const posts = response.data;
        const params = this.state.params;
        params.posts = posts;

        this.setState({
          params: params,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const post = props.post;
  return (
    <Feed item={post} viewerId={props.viewerId} onClickDelete={onClickDelete} />
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
  function onClickDelete(e) {
    const uuid = e.target.dataset.uuid;
    const data = useContext(DataContext);
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

        this.setState({
          params: params,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const post = props.post;
  let comments = null;
  if (post.comments.length) {
    comments = (
      <Comments
        comments={post.comments}
        viewerId={props.viewerId}
        onClickDelete={onClickDelete}
      />
    );
  }

  return (
    <>
      <Post
        post={post}
        viewerId={props.viewerId}
        onClickDelete={onClickDelete}
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
  // const [data, setData] = useState(iniData);

  // useEffect(setup, []);

  // function setup() {
  //   // 一番上のstateを更新せんといかん。
  //   // const data = { params: props.history.location.state };
  //   // if (data) {
  //   //   setData(data);
  //   // }
  // }

  const user = data.params.user;

  if (user) {
    const posts = data.params.following_posts;

    return (
      <div className="row">
        <div className="col-12">
          <Subtitle subtitle="Home" />
          <Posts posts={posts} viewerId={user.id} />
        </div>
      </div>
    );
  } else {
    return <></>;
  }
}

Posts.propTypes = {
  posts: PropTypes.array,
  viewerId: PropTypes.number,
};

PostWithComments.propTypes = {
  post: PropTypes.object,
  viewerId: PropTypes.number,
};

Post.propTypes = {
  post: PropTypes.object,
  viewerId: PropTypes.number,
};
