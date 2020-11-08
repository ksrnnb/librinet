import React, { useContext, useState } from 'react';
import Subtitle from '../components/Subtitle';
import UserCard from '../components/UserCard';
import { BookCard } from '../components/BookCard';
import { PropsContext } from '../components/MyRouter';
import { DataContext, SetParamsContext } from './App';
import { MyLink } from '../functions/MyLink';
import { Modal, Button } from 'react-bootstrap';
import { Book } from '../types/Interfaces';
import {
  Response,
  Data,
  RouterProps,
  Params,
  SetParams,
} from '../types/Interfaces';

const axios = window.axios;

interface BooksProps {
  books: Book[];
  deleteList: number[];
  setDeleteList: (ids: number[]) => void;
}

function Books(props: BooksProps) {
  const { books, deleteList, setDeleteList } = props;

  function onClick(e: any) {
    // クリックすると、子要素、孫要素がevent.targetに入っているので、目的のdivまで上に遡る
    function getCard(node: any): any {
      const parentNode = node.parentNode;
      if (parentNode.classList.contains('delete-book-card')) {
        return parentNode;
      } else {
        return getCard(parentNode);
      }
    }

    const id = Number(getCard(e.target).dataset.id);
    const hasId = deleteList.includes(id);
    let newList;

    if (hasId) {
      newList = deleteList.filter((value: number) => value !== id);
    } else {
      newList = deleteList.slice();
      newList.push(id);
    }

    setDeleteList(newList);
  }

  const booksJsx = books.map((book: Book) => {
    const willDelete = deleteList.includes(book.id);
    return (
      <div
        className="delete-book-card mb-3"
        data-id={book.id}
        data-willdelete={willDelete}
        key={book.id}
        onClick={onClick}
      >
        <BookCard book={book} />
      </div>
    );
  });

  return <>{booksJsx}</>;
}

interface DeleteBooksProps {
  orderedBooks: {
    [x: string]: Book[];
  };
  genres: {
    [x: string]: string;
  };
  deleteList: number[];
  setDeleteList: (ids: number[]) => void;
}

function DeleteBooks(props: DeleteBooksProps) {
  const { orderedBooks, genres, deleteList, setDeleteList } = props;
  const Bookshelf = Object.keys(orderedBooks).map((genre_id) => {
    return (
      <div key={genre_id}>
        <h4 className="mt-5">{genres[genre_id]}</h4>
        <Books
          books={orderedBooks[genre_id]}
          deleteList={deleteList}
          setDeleteList={setDeleteList}
        />
      </div>
    );
  });

  return <>{Bookshelf}</>;
}

interface DeleteButtonProps {
  onClick: () => void;
}

function DeleteButton(props: DeleteButtonProps) {
  const onClick = props.onClick;
  return (
    <button className="btn btn-outline-danger d-block my-5" onClick={onClick}>
      削除する
    </button>
  );
}

interface ModalProps {
  show: boolean;
  handleClose: () => void;
  onSubmitDelete: () => void;
}

function ModalWindow(props: ModalProps) {
  const { show, handleClose, onSubmitDelete } = props;

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>本の削除</Modal.Title>
        </Modal.Header>
        <Modal.Body>選択した本を削除しますか？</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            キャンセル
          </Button>
          <Button variant="primary" onClick={onSubmitDelete}>
            はい
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default function DeleteBook() {
  const props: RouterProps = useContext(PropsContext);
  const data: Data = useContext(DataContext);
  const params: Params = data.params;
  const setParams: SetParams = useContext(SetParamsContext);
  const [deleteList, setDeleteList] = useState<number[]>([]);
  const [show, setShow] = useState<boolean>(false);

  function redirectUserProfile() {
    const strId: string = props.match.params.strId;
    MyLink.userProfile(props, strId);
  }

  function onSubmitDelete() {
    const path = '/api/book';

    if (deleteList.length) {
      axios
        .delete(path, {
          data: { ids: deleteList },
        })
        .then((response: Response) => {
          setParams(response.data);
          redirectUserProfile();
        })
        .catch(() => {
          alert('エラーが発生し、本が削除できませんでした');
        });
    } else {
      alert('本が選択されていません');
    }
  }

  return (
    <>
      <Subtitle subtitle="本の削除" />
      <UserCard user={params.user} />
      <h4 className="text-danger mt-5">削除したい本を選択してください</h4>
      <DeleteBooks
        orderedBooks={params.user.ordered_books}
        genres={params.user.genres}
        deleteList={deleteList}
        setDeleteList={setDeleteList}
      />
      <DeleteButton onClick={() => setShow(true)} />
      <ModalWindow
        show={show}
        handleClose={() => setShow(false)}
        onSubmitDelete={onSubmitDelete}
      />
    </>
  );
}
