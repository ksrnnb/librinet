import React from 'react';
import Subtitle from './Subtitle';
import Feed from './Feed';
const axios = window.axios;

function GenreForm(props) {
  const genresBooks = props.genresBooks;
  const genres = props.genres;
  if (genresBooks) {
    const options = Object.keys(genresBooks).map((genreId) => {
      return (
        <optgroup label={genres[genreId]} key={genreId}>
          {genresBooks[genreId].map((book) => {
            return (
              <option value={book.id} key={book.id}>
                {book.title}
              </option>
            );
          })}
        </optgroup>
      );
    });

    return (
      <select
        name="book_id"
        id="select-book"
        disabled={!props.isRecommended}
        onChange={(e) => {
          props.setBookId(e.target.value);
        }}
      >
        {options}
      </select>
    );
  }
}

function RecommendButton(props) {
  return (
    <label htmlFor="recommend" className="mt-5">
      <input
        type="checkbox"
        name="recommend"
        id="recommend"
        checked={props.isRecommended}
        onChange={props.onChangeRecommend}
      />
      本もおすすめする
    </label>
  );
}
function RecommendBook(props) {
  const genresBooks = props.genresBooks;
  const genres = props.genres;
  const isRecommended = props.isRecommended;

  if (genresBooks) {
    return (
      <>
        <RecommendButton
          isChecked={isRecommended}
          onChangeRecommend={props.onChangeRecommend}
        />
        <GenreForm
          genres={genres}
          genresBooks={genresBooks}
          isRecommended={isRecommended}
          setBookId={props.setBookId}
        />
      </>
    );
  }
  return <></>;
}

function CommentForm(props) {
  const message = props.message;
  return (
    <>
      <p className="mt-5">Comment</p>
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
      bookId: null,
      item: null,
      isPost: null,
      isRecommended: false,
      message: '',
    };

    this.onChangeMessage = this.onChangeMessage.bind(this);
    this.onChangeRecommend = this.onChangeRecommend.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.setItem = this.setItem.bind(this);
    this.setBookId = this.setBookId.bind(this);
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

  onChangeRecommend() {
    const isRecommended = !this.state.isRecommended;

    if (isRecommended) {
      const id = document.getElementById('select-book').value;

      this.setState({
        bookId: id,
        isRecommended: isRecommended,
      });
    } else {
      this.setState({
        isRecommended: isRecommended,
      });
    }
  }

  onSubmit() {
    const bookId = this.state.isRecommended ? this.state.bookId : null;
    const isPost = this.state.isPost;
    const itemId = this.state.item.id;
    const message = this.state.message;
    const userId = this.props.viewerId;

    const params = {
      book_id: bookId,
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
          // Functions.prototype.redirectHome.call(this);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  setBookId(id) {
    this.setState({
      bookId: id,
    });
  }

  setItem(data) {
    this.setState({
      item: data.item,
      isPost: data.is_post,
    });
  }

  render() {
    const item = this.state.item;
    const isRecommended = this.state.isRecommended;
    const genresBooks = this.props.genresBooks;
    const genres = this.props.genres;
    const message = this.props.message;
    const viewerId = this.props.viewerId;

    if (item) {
      return (
        <>
          <Subtitle subtitle="Comment Page" />
          <Feed item={item} viewerId={viewerId} />
          <RecommendBook
            genresBooks={genresBooks}
            genres={genres}
            isRecommended={isRecommended}
            onChangeRecommend={this.onChangeRecommend}
            setBookId={this.setBookId}
          />
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
