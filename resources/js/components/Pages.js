import React from 'react';
import AddBook from './AddBook';
import Book from './Book';
import Comment from './Comment';
import Home from './Home';
import Login from './Login';
import Logout from './Logout';
import UserProfile from './UserProfile';
import PostData from './Post';
import User from './User';
import EditGenre from './EditGenre';
import EditUser from './EditUser';
import DeleteBook from './DeleteBook';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

export const PropsContext = React.createContext();

export default function Pages(props) {
  const params = props.params;
  const exampleUsers = params ? params.example_users : null;
  const genresBooks = params ? params.genres_books : null;
  const genres = params ? params.genres : null;
  const posts = params ? params.posts : null;
  const viewerId = params ? params.user.id : null;
  const viewerStrId = params ? params.user.str_id : null;
  const viewerUser = params ? params.user : null;

  // これらがないと、コンポーネント側で読み込めない
  const logout = props.logout;
  const login = props.login;
  const setStateUser = props.setStateUser;
  const setStateBooks = props.setStateBooks;
  const setStateGenresBooks = props.setStateGenresBooks;

  return (
    <div id="main-column">
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
        <Route
          exact
          path="/book"
          render={(props) => <Book props={props} params={params} />}
        />
        <Route
          path="/genre/edit/:strId"
          render={(props) => <EditGenre props={props} params={params} />}
        />
        <Route
          exact
          path="/user"
          render={(props) => (
            <PropsContext.Provider value={props}>
              <User props={props} example={exampleUsers} />
            </PropsContext.Provider>
          )}
        />
        <Route
          path="/user/profile/:strId"
          render={(props) => (
            <PropsContext.Provider value={props}>
              <UserProfile
                props={props}
                params={params}
                viewerUser={viewerUser}
              />
            </PropsContext.Provider>
          )}
        />
        <Route
          path="/user/edit/:strId"
          render={(props) => (
            <EditUser
              props={props}
              params={params}
              setStateUser={setStateUser}
            />
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
          path="/book/delete/:strId"
          render={(props) => (
            <DeleteBook
              props={props}
              params={params}
              setStateBooks={setStateBooks}
              setStateGenresBooks={setStateGenresBooks}
            />
          )}
        />
        <Route
          path="/book/add/:isbn"
          render={(props) => <AddBook props={props} />}
        />
        <Route
          path="/comment/:uuid"
          render={(props) => (
            <Comment
              props={props}
              genresBooks={genresBooks}
              genres={genres}
              viewerId={viewerId}
            />
          )}
        />
      </Switch>
    </div>
  );
}
