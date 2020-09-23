import React from 'react';
import ReactDOM from 'react-dom';

const axios = require('axios');


function Message() {
    return <p>(* ハイフンは除かなくても検索可能)</p>;
}

// 例を表示。もうすこしあったほうがいい？
function Example() {
    return(
        <>
            <p>例</p>
            <p>9784297100339 Docker/Kubernetes実践コンテナ開発入門</p>
            <p>9784839955557 ノンデザイナーズ・デザインブック</p>
        </>
    );
}

function UserInput(props) {    
    return <input type="text" id="isbn" name="isbn" onChange={props.onChange} required />;
}

function Button(props) {
    return <button className="btn btn-outline-success" onClick={props.onClick} id="search">検索</button>;
}

class Book extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            input: null,
            book: null,
            errorMessage: null,
            isNotInBookshelf: null,
        }
        
        this.bookImage = this.bookImage.bind(this);
        this.bookInfo = this.bookInfo.bind(this);
        this.onChangeInput = this.onChangeInput.bind(this);
        this.sendPost = this.sendPost.bind(this);
        this.setBook = this.setBook.bind(this);
        this.setError = this.setError.bind(this);
        this.validateInputAndReturnIsbn = this.validateInputAndReturnIsbn.bind(this);
    }

    bookImage() {
        const book = this.state.book;
        let image;

        if (book.cover) {
            image = <img className="img-fluid" src={book.cover} alt="book_image" />;
        } else {
            image = <img className="img-fluid" src="../img/book.svg" alt="book_image" />;
        }
    
        return (
                    <div className="col-3">
                        <figure className="mx-2 px-0 mb-0 book">
                            {image}
                        </figure>
                    </div>
        );
            
    }

    bookInfo() {
        const book = this.state.book;
        const pub_year = book.pubdate.slice(0, 4) + '年';

        const isNotInBookshelf = this.state.isNotInBookshelf;
        let addButton = null;

        if (isNotInBookshelf) {
            addButton = <a href={'/book/add/' + book.isbn}>
                            <button type="button" className="btn btn-outline-success">本棚に追加する</button>
                        </a>;
        }

        return (
            <div className="col-9">
                <p>タイトル： {book.title}</p>
                <p>著者：{book.author}</p>
                <p>出版社：{book.publisher}</p>
                <p>出版年：{pub_year}</p>
                <a href={'/book/post/' + book.isbn}>
                    <button type="button" className="btn btn-outline-success">本の投稿をする</button>
                </a>
                {addButton}
            </div>
        );
    }
    
    onChangeInput(e) {
        this.setState({
            input: e.target.value,
        });
    }

    // TODO エンターを押しても送信できるようにしたい
    // pressEnter(e) {
    //     const keyCode = e.charCode;
    //     console.log(e);
        
    //     if (keyCode == 13) {
    //         console.log('Enter!?');
    //         this.sendPost();
    //     }
    // }
    
    setBook(params) {
        this.setState({
            book: params.book,
            isNotInBookshelf: params.isNotInBookshelf,
            errorMessage: null,
        });
    }
    
    setError(error) {
        let errorMessage;
        
        if (error == 'InputError') {
            errorMessage = '正しいISBNが入力されていません';
            
        } else if (error == 'NotFound') {
            errorMessage = '本が見つかりませんでした';
            
        } else {
            errorMessage = '予期しないエラーが発生しました';
        }
        
        this.setState({
            errorMessage: errorMessage,
        });
    }
    
    sendPost() {
        const input = this.state.input;
        const isbn = this.validateInputAndReturnIsbn(input);
        
        if (isbn) {
            axios.post('/book', {
                isbn: input,
            })
            .then(response => {
                this.setBook(response.data.params);
            })
            .catch(error => {
                // 本が見つからない場合は404に設定した (BookController)
                if (error.response.status = 404) {
                    this.setError('NotFound');
                } else {
                    // サーバー側のvalidationに引っ掛かった場合など。
                    // JavaScript側のvalidationで十分だと思うけど一応。
                    this.setError('UnknownError');
                }
            });
        } else {
            this.setError('InputError')
        }
    }

    validateInputAndReturnIsbn(input) {
        if (input == null) return false;

        let isbn = input.replace(/-/g, '');
        isbn = isbn.match(/^9784[0-9]{9}$/);
        if (isbn != null) {
            return isbn;
        } else {
            return false;
        }
    }
    
    render() {
        const searchedBook = this.state.book != null;
        let bookElement = null;
        if (searchedBook) {
            bookElement =   <div className="row mt-5 book">
                                {this.bookImage()}
                                {this.bookInfo()}
                            </div>;
        }

        let errorMessage;
        const error = this.state.errorMessage;
        if (error) {
            errorMessage = <p className="error text-danger">{error}</p>
        }

        return (
            <div>
                {errorMessage}
                <UserInput onChange={this.onChangeInput}/>
                <Button onClick={this.sendPost}/>
                <Message />
                <Example />
                {bookElement}
            </div>
        );
    }
}

if (document.getElementById('book-react')) {
    ReactDOM.render(<Book />, document.getElementById('book-react'));
}
