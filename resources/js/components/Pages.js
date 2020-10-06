import React from 'react';
import AddBook from './AddBook';
import Book from './Book';
import Comment from './Comment';
import Home from './Home';
import Login from './Login';
import Logout from './Logout';
import Profile from './Profile';
import PostData from './Post';
import User from './User';
import EditGenre from './EditGenre';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

export default function Pages(props) {
  const params = props.params;
  const exampleUsers = params ? params.example_users : null;
  const genresBooks = params ? params.genres_books : null;
  const genres = params ? params.genres : null;
  const posts = params ? params.posts : null;
  const viewerId = params ? params.user.id : null;
  const viewerStrId = params ? params.user.str_id : null;

  let margin = null;
  if (props.isVisible) {
    margin = 'ml-300';
  }

  // これらがないと、コンポーネント側で読み込めない
  const logout = props.logout;
  const login = props.login;

  return (
    <div className={margin}>
      <Switch>
        <Route
          path="/home"
          render={() => (
            <Home
              posts={posts}
              viewerId={viewerId}
              onClickDelete={props.onClickDelete}
            />
          )}
        />
        <Route exact path="/book" render={(props) => <Book props={props} />} />
        <Route
          path="/genre/edit/:strId"
          render={(props) => <EditGenre params={params} props={props} />}
        />
        <Route
          exact
          path="/user"
          render={() => <User example={exampleUsers} />}
        />
        <Route
          path="/user/profile/:strId"
          render={(props) => (
            <Profile props={props} params={params} viewerUser={viewerStrId} />
          )}
        />
        <Route
          path="/login"
          render={(props) => <Login props={props} login={login} />}
        />
        <Route
          path="/logout"
          render={(props) => <Logout props={props} logout={logout} />}
        />
        <Route
          path="/book/post/:isbn"
          render={(props) => <PostData props={props} />}
        />
        <Route
          path="/book/add/:isbn"
          render={(props) => <AddBook props={props} />}
        />
        <Route
          path="/comment/:uuid"
          render={(props) => (
            <Comment
              genresBooks={genresBooks}
              genres={genres}
              viewerId={viewerId}
              props={props}
            />
          )}
        />
      </Switch>
    </div>
  );
}
