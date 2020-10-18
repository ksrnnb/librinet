import AddBook from './AddBook';
import Book from './Book';
import BookProfile from './BookProfile';
import Comment from './Comment';
import ErrorPage from './ErrorPage';
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
import Signup from './Signup';
import Notification from './Notification';

export const routingList = [
  {
    path: '/home',
    component: Home,
  },

  {
    path: '/login',
    component: Login,
  },

  {
    path: '/logout',
    component: Logout,
  },

  {
    isExact: true,
    path: '/signup',
    component: Signup,
  },

  {
    isExact: true,
    path: '/user',
    component: User,
  },

  {
    isExact: true,
    path: '/user/profile/:strId',
    component: UserProfile,
  },

  {
    path: '/user/profile/:strId/:target',
    component: Followers,
  },

  {
    path: '/user/edit/:strId',
    component: EditUser,
  },

  {
    isExact: true,
    path: '/book',
    component: Book,
  },

  {
    path: '/book/profile/:isbn',
    component: BookProfile,
  },

  {
    path: '/book/add/:isbn',
    component: AddBook,
  },

  {
    path: '/book/post/:isbn',
    component: PostData,
  },

  {
    path: '/book/delete/:strId',
    component: DeleteBook,
  },

  {
    path: '/genre/edit/:strId',
    component: EditGenre,
  },

  {
    path: '/comment/:uuid',
    component: Comment,
  },

  {
    path: '/notification',
    component: Notification,
  },

  {
    path: '/error',
    component: ErrorPage,
  },
];
