export interface RouterProps {
  history: History;
  location: RouterLocation;
  match: Match;
}

export interface History {
  action: string;
  location: {
    pathname: string;
    state: any;
  };
  push: (path: string, state?: any) => void;
}

export interface RouterLocation {
  pathname: string;
  state?: any;
}

export interface Match {
  params: any;
  path: string;
  url: string;
}

export interface Data {
  hasLoaded: boolean;
  params: Params;
}

export interface Params {
  examples: User[];
  following_posts: Post[];
  user: UserParams;
}

export type SetParams = (params: Params) => void;

export interface Book {
  user_id: number;
  genre_id: number;
  id: number;
  isInBookshelf?: boolean;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  pubdate: string;
  cover: string;
}

export interface UserParams {
  books: Book[];
  comments: Comment[];
  email: string;
  followers: User[];
  followings: User[];
  genres: any; // any
  id: number;
  image?: string;
  name: string;
  notifications: Notification;
  ordered_books: any; // any
  posts: Post[];
  str_id: string;
}

export interface Comment {
  book: Book;
  book_id: number;
  id: number;
  likes: Like[];
  message: string;
  post_id: number;
  user: User;
  user_id: number;
  uuid: string;
}

export interface Like {
  comment_id: number;
  id: number;
  post_id: number;
  user_id: number;
}

export interface Post {
  book: Book;
  book_id: number;
  comments: Comment[];
  id: number;
  likes: Like[];
  message: string;
  user: User;
  user_id: number;
  uuid: string;
}

export interface User {
  books: Book[];
  comments: Comment[];
  email: string;
  str_id: string;
  // genres: Genre,
  id: number;
  image?: string;
  name: string;
}

export interface Response {
  data: any;
}

export interface ErrorResponse {
  response: {
    status: number;
    data: any;
  };
}
