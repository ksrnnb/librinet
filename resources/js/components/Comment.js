import React, { useContext, useEffect, useState } from 'react';
import Subtitle from './Subtitle';
import { PostWithComments } from './Home';
import { PropTypes } from 'prop-types';
import { PropsContext } from './Pages';
import { DataContext, SetStateContext } from './App';
import Errors from './Errors';
import {
  MyButton,
  GroupedSelectBox,
  InputWithCheck,
  MyTextarea,
} from './Components';

const axios = window.axios;

// function GenreForm(props) {
//   const orderedBooks = props.orderedBooks;
//   const genres = props.genres;
//   if (orderedBooks) {
//     const options = Object.keys(orderedBooks).map((genreId) => {
//       return (
//         <optgroup label={genres[genreId]} key={genreId}>
//           {orderedBooks[genreId].map((book) => {
//             return (
//               <option value={book.id} key={book.id}>
//                 {book.title}
//               </option>
//             );
//           })}
//         </optgroup>
//       );
//     });

//     return (
//       <select
//         name="book_id"
//         id="select-book"
//         disabled={!props.isRecommended}
//         onChange={(e) => {
//           props.setBookId(e.target.value);
//         }}
//       >
//         {options}
//       </select>
//     );
//   }
// }

function RecommendBook(props) {
  const orderedBooks = props.orderedBooks;
  const genres = props.genres;
  const isRecommended = props.isRecommended;
  const onChange = props.onChange;
  const hasBook = !Array.isArray(orderedBooks);

  if (hasBook) {
    return (
      <>
        <InputWithCheck
          name="recommend"
          type="checkbox"
          checked={isRecommended}
          onChange={onChange}
          content="本もおすすめする"
        />
        <GroupedSelectBox
          genres={genres}
          orderedBooks={orderedBooks}
          disabled={!isRecommended}
          onChange={(e) => {
            props.setBookId(e.target.value);
          }}
        />
      </>
    );
  }
  return <></>;
}

function CommentForm(props) {
  return (
    <>
      <MyTextarea
        name="message"
        onChange={props.onChange}
        content="コメントメッセージ"
      />
      <MyButton onClick={props.onClick} content="コメントする" withMargin={true}/>
    </>
  );
}

export default function Comment() {
  const props = useContext(PropsContext);
  const params = useContext(DataContext).params;
  const setState = useContext(SetStateContext);

  const [bookId, setBookId] = useState(null);
  const [item, setItem] = useState(null);
  const [isRecommended, setIsRecommended] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);

  useEffect(setup, []);

  function setup() {
    const item = props.location.state;

    item ? setItem(item) : getComment();

    function getComment() {
      const path = '/api/comment/' + props.match.params.uuid;
      axios
        .get(path)
        .then((response) => {
          const post = response.data;
          setItem(post);
        })
        .catch((error) => {
          // TODO: errorの場合の処理
          if (error.response.status === 401) {
            props.history.push('/home');
          } else if (error.response.status === 404) {
            setErrors([error.response.data]);
          } else {
            // console.log('hoge');
          }
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

    if (message === '') {
      setErrors(['コメントが入力されていません']);
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
          orderedBooks={user.ordered_books}
          genres={user.genres}
          isRecommended={isRecommended}
          setMessage={setMessage}
          setBookId={setBookId}
          onChange={onChangeRecommend}
        />
        <Errors errors={errors} />
        <CommentForm
          onClick={onSubmit}
          onChange={(e) => setMessage(e.target.value)}
        />
      </>
    );
  } else {
    return <Errors errors={errors} />;
  }
}

RecommendBook.propTypes = {
  orderedBooks: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  genres: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  isRecommended: PropTypes.bool,
  onChange: PropTypes.func,
  setBookId: PropTypes.func,
};

CommentForm.propTypes = {
  onChange: PropTypes.func,
  onClick: PropTypes.func,
};
