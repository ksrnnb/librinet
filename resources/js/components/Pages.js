import React from 'react';
import AddBook from './AddBook';
import Book from './Book';
import BookProfile from './BookProfile';
import Comment from './Comment';
import Home from './Home';
import Login from './Login';
import Logout from './Logout';
import UserProfile from './UserProfile';
import PostData from './Post';
import User from './User';
import Followers from './Followers';
import EditGenre from './EditGenre';
import EditUser from './EditUser';
import DeleteBook from './DeleteBook';
import { Switch, Route } from 'react-router-dom';

export const PropsContext = React.createContext();

export default function Pages(props) {
  const params = props.params;
  const exampleUsers = params ? params.example_users : null;
  const genresBooks = params ? params.genres_books : null;
  const genres = params ? params.genres : null;
  const posts = params ? params.posts : null;
  const viewerId = params ? params.user.id : null;

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
              onClickDelete={props.onClickDelete}
            />
          )}
        />
        <Route
          exact
          path="/book"
          render={(props) =>
            <PropsContext.Provider value={props}>
              <Book />
            </PropsContext.Provider>
          }
        />
        <Route
          path="/book/profile/:isbn"
          render={(props) =>
            <PropsContext.Provider value={props}>
              <BookProfile />
            </PropsContext.Provider>
          }
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
          exact
          path="/user/profile/:strId"
          render={(props) => (
            <PropsContext.Provider value={props}>
              <UserProfile />
            </PropsContext.Provider>
          )}
        />
        <Route
          path="/user/profile/:strId/:target"
          render={(props) => (
            <PropsContext.Provider value={props}>
              <Followers />
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
