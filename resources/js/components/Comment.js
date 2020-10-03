import React from 'react';
import Subtitle from './Subtitle';
import Feed from './Feed';
import Functions from './Functions';
const axios = window.axios;

function RecommendBook(props) {
  const genresBooks = props.genresBooks;
  // if (genresBooks) {
  //   Object.keys(genresBooks).map(genre

  //   );
  // }
  return <></>;
}

function CommentForm(props) {
  const message = props.message;
  return (
    <>
      <p>Comment</p>
      <textarea cols="30" rows="10" value={message} onChange={props.onChange} />
      <button
        className="btn btn-outline-success d-block"
        onClick={props.onClick}
      >
        コメントする
      </button>
    </>
  );
}

export default class Comment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      item: null,
      isPost: null,
      message: '',
    };

    this.onChangeMessage = this.onChangeMessage.bind(this);
    this.setItem = this.setItem.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    const path = '/api/comment/' + this.props.props.match.params.uuid;
    axios
      .get(path)
      .then((response) => {
        this.setItem(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  onChangeMessage(e) {
    const message = e.target.value;
    this.setState({
      message: message,
    });
  }

  onSubmit() {
    const isPost = this.state.isPost;
    const itemId = this.state.item.id;
    const message = this.state.message;
    const userId = this.props.viewerId;

    const params = {
      is_post: isPost,
      post_id: itemId,
      message: message,
      user_id: userId,
    };

    const uuid = this.props.props.match.params.uuid;
    const path = '/api/comment/' + uuid;

    if (message == '') {
      console.log('Message is Empty!');
    } else {
      axios
        .post(path, params)
        .then((response) => {
          console.log(response.data);
          Functions.prototype.redirectHome.call(this);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  setItem(data) {
    this.setState({
      item: data.item,
      isPost: data.is_post,
    });
  }

  render() {
    const item = this.state.item;
    const genresBooks = this.props.genresBooks;
    const genres = this.props.genres;
    const message = this.props.message;
    const viewerId = this.props.viewerId;

    if (item) {
      return (
        <>
          <Subtitle subtitle="Comment Page" />
          <Feed item={item} viewerId={viewerId} />
          <RecommendBook genresBooks={genresBooks} genres={genres} />
          <CommentForm
            message={message}
            onClick={this.onSubmit}
            onChange={this.onChangeMessage}
          />
        </>
      );
    } else {
      return <></>;
    }
  }
}
