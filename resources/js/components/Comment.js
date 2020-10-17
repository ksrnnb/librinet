import React, { useContext, useEffect, useState } from 'react';
import Subtitle from './Subtitle';
import { PostWithComments } from './Home';
import { PropTypes } from 'prop-types';
import { PropsContext } from './Pages';
import { DataContext, SetStateContext } from './App';

const axios = window.axios;

function GenreForm(props) {
  const orderedBooks = props.orderedBooks;
  const genres = props.genres;
  if (orderedBooks) {
    const options = Object.keys(orderedBooks).map((genreId) => {
      return (
        <optgroup label={genres[genreId]} key={genreId}>
          {orderedBooks[genreId].map((book) => {
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
        onChange={props.onChange}
      />
      本もおすすめする
    </label>
  );
}
function RecommendBook(props) {
  // TODO: 本のお勧めが表示されない
  const orderedBooks = props.orderedBooks;
  const genres = props.genres;
  const isRecommended = props.isRecommended;

  if (orderedBooks) {
    return (
      <>
        <RecommendButton isChecked={isRecommended} onChange={props.onChange} />
        <GenreForm
          genres={genres}
          orderedBooks={orderedBooks}
          isRecommended={isRecommended}
          setBookId={props.setBookId}
        />
      </>
    );
  }
  return <></>;
}

function CommentForm(props) {
  return (
    <>
      <p className="mt-5">Comment</p>
      <textarea cols="30" rows="10" onChange={props.onChange} />
      <button
        className="btn btn-outline-success d-block"
        onClick={props.onClick}
      >
        コメントする
      </button>
    </>
  );
}

export default function Comment() {
  const [bookId, setBookId] = useState(null);
  const [item, setItem] = useState(null);
  const [isRecommended, setIsRecommended] = useState(false);
  const [message, setMessage] = useState('');

  const props = useContext(PropsContext);
  const params = useContext(DataContext).params;
  const setState = useContext(SetStateContext);

  useEffect(setup, []);

  function setup() {
    const item = props.location.state;

    console.log(item);
    item ? setItem(item) : getComment();

    function getComment() {
      const path = '/api/comment/' + props.match.params.uuid;
      axios
        .get(path)
        .then((response) => {
          const data = response.data;
          setItem(data.item);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  function onChangeRecommend() {
    const newIsRecommended = !isRecommended;
    setIsRecommended(newIsRecommended);

    if (newIsRecommended) {
      const id = document.getElementById('select-book').value;
      setBookId(id);
    }
  }

  function onSubmit() {
    const userId = params.user.id;

    const paramsForPost = {
      book_id: bookId,
      post_id: item.id,
      message: message,
      user_id: userId,
    };

    const uuid = props.match.params.uuid;
    const path = '/api/comment/' + uuid;

    if (message == '') {
      console.log('Message is Empty!');
    } else {
      axios
        .post(path, paramsForPost)
        .then((response) => {
          setState.params(response.data);
          window.scroll(0, 0);
          props.history.push('/home');
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  if (item) {
    const user = params.user;
    const viewerId = user.id;
    return (
      <>
        <Subtitle subtitle="Comment Page" />
        <PostWithComments post={item} viewerId={viewerId} />
        <RecommendBook
          orderedBooks={user.orderedBooks}
          genres={user.genres}
          isRecommended={isRecommended}
          setMessage={setMessage}
          setBookId={setBookId}
          onChange={onChangeRecommend}
        />
        <CommentForm
          onClick={onSubmit}
          onChange={(e) => setMessage(e.target.value)}
        />
      </>
    );
  } else {
    return <></>;
  }
}

RecommendButton.propTypes = {
  isRecommended: PropTypes.bool,
  onChange: PropTypes.func,
};

RecommendBook.propTypes = {
  orderedBooks: PropTypes.object,
  genres: PropTypes.array,
  isRecommended: PropTypes.bool,
  onChange: PropTypes.func,
  setBookId: PropTypes.func,
};

CommentForm.propTypes = {
  onChange: PropTypes.func,
  onClick: PropTypes.func,
};
