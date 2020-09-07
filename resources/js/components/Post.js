import React from 'react';
import ReactDOM from 'react-dom';

class Post extends React.Component {
  render() {
    const user = window.user;
    const books = window.books;
    const genres = window.genres;
    return (
        <div className="container">

          <Avator image={user.image} />
          <p>Id: {user.str_id}</p>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <BookShelf books={books} genres={genres}/>
        </div>
    );
  }
}


if (document.getElementById('post-react')) {
    ReactDOM.render(<Post />, document.getElementById('post-react'));
}
