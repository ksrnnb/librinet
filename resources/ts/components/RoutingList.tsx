import AddBook from '../views/AddBook';
import Book from '../views/Book';
import BookProfile from '../views/BookProfile';
import Comment from '../views/Comment';
import ErrorPage from '../views/ErrorPage';
import Home from '../views/Home';
import Login from '../views/Login';
import Logout from '../views/Logout';
import UserProfile from '../views/UserProfile';
import PostData from '../views/Post';
import User from '../views/User';
import Followers from '../views/Followers';
import EditGenre from '../views/EditGenre';
import EditUser from '../views/EditUser';
import DeleteBook from '../views/DeleteBook';
import Signup from '../views/Signup';
import Notification from '../views/Notification';
import TopPage from '../views/TopPage';

interface RoutingList {
  isExact?: boolean;
  path: string;
  component: any;
}

export const routingList: Array<RoutingList> = [
  {
    isExact: true,
    path: '/',
    component: TopPage,
  },

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
