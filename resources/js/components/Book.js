import React from 'react';
import ReactDOM from 'react-dom';

const axios = require('axios');


function SubColumn() {

    const strId = document.getElementById('user-id').value;
    const userUrl = '/user/show/' + strId;

    return (
                <div className="sub-column border-right">
                    <a href="/home" className="no-link">
                        <h4 className="no-link">ホーム</h4>
                    </a>
                    <a href="/book" className="no-link">
                        <h4 className="mt-4">本を検索する</h4>
                    </a>
                    <a href="/user/search" className="no-link">
                        <h4 className="mt-4">ユーザーを検索する</h4>
                    </a>
                    <a href={userUrl} className="no-link">
                        <h4 className="mt-4">プロフィール</h4>
                    </a>
                    <a href="/logout" className="no-link">
                        <h4 className="mt-4">ログアウト</h4>
                    </a>
                </div>
    );
}

function Subtitle() {
    return <h2>本の検索</h2>;
}

function InputPrompt() {
    return  (
            <>
                <h4 className="mt-3 mb-0">13桁のISBNを入力してください</h4>
                <p>（9784... ハイフン有りでもOK）</p>
            </>
    );
}

function ShowExamples() {
    const exampleBooks = new Map([
        [9784798060996, 'PHPフレームワーク Laravel入門 第2版'],
        [9784297100339, 'Docker/Kubernetes実践コンテナ開発入門'],
        [9784839955557, 'ノンデザイナーズ・デザインブック'],
    ]);

    const tableRows = [];
    exampleBooks.forEach((title, isbn) => {
        tableRows.push(
                <tr key={isbn}>
                    <td>{isbn}</td>
                    <td>{title}</td>
                </tr>
        );
    });

    return tableRows;
}

function Example() {
    return(
        <div>
            <p className="pl-3 mt-3">例</p>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">ISBN</th><th scope="col">Title</th>
                    </tr>
                </thead>
                <tbody>
                    <ShowExamples />
                </tbody>
            </table>
        </div>
    );
}

function UserInput(props) {    
    // 微妙に上下にpadding/marginがあるので省く
    return <input className="mr-3 py-0" type="text" id="isbn" name="isbn" onChange={props.onChange} required />;
}

function Button(props) {
    return <input type="button" className="btn btn-outline-success" onClick={props.onClick} id="search" value="検索" />;
}

class Book extends React.Component {

    constructor(props) {
        super(props);

        // windowサイズが800px以上であればカラムを表示
        this.maxWidth = 800;
        const isVisible = window.innerWidth > this.maxWidth ? true : false;
        
        this.state = {
            input: null,
            book: null,
            errorMessage: null,
            isNotInBookshelf: null,
            isVisible: isVisible,
        }
        
        this.bookImage = this.bookImage.bind(this);
        this.bookInfo = this.bookInfo.bind(this);
        this.onChangeInput = this.onChangeInput.bind(this);
        this.sendPost = this.sendPost.bind(this);
        this.setBook = this.setBook.bind(this);
        this.setError = this.setError.bind(this);
        this.validateInputAndReturnIsbn = this.validateInputAndReturnIsbn.bind(this);

        this.windowSizeChange.call(this);
    }

    windowSizeChange() {
        window.addEventListener('resize', () => {
            let isVisible = this.state.isVisible;
            const changedLargeToSmall = isVisible && window.innerWidth < this.maxWidth;
            const changedSmallToLarge = (! isVisible) && window.innerWidth > this.maxWidth;
            
            if (changedLargeToSmall || changedSmallToLarge) {
                this.setState({
                    isVisible: ! isVisible,
                });
            }
        });
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
                <p className="one-row">タイトル： {book.title}</p>
                <p className="one-row mt-3">著者：{book.author}</p>
                <p className="one-row mt-3">出版社：{book.publisher}</p>
                <p className="one-row mt-3">出版年：{pub_year}</p>
                <a href={'/book/post/' + book.isbn}>
                    <button type="button" className="btn btn-outline-success mr-3">本の投稿をする</button>
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
            errorMessage = 'ISBNが正しく入力されていません';
            
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

        if (this.state.isVisible) {
            
            return (
                <div>
                    <div>
                        <SubColumn />
                    </div>
                    {/* SubColumnと同じ幅のmargin */}
                    <div className="ml-300">
                        <Subtitle />
                        <label htmlFor="isbn">
                            <InputPrompt />
                            {errorMessage}
                            <UserInput onChange={this.onChangeInput}/>
                            <Button onClick={this.sendPost}/>
                        </label>
                        <Example />
                        {bookElement}
                    </div>
                </div>
            );
        } else {

            return (
                <div>
                    <Subtitle />
                    <label htmlFor="isbn">
                        <InputPrompt />
                        {errorMessage}
                        <UserInput onChange={this.onChangeInput}/>
                        <Button onClick={this.sendPost}/>
                    </label>
                    <Example />
                    {bookElement}
                </div>
            );
        }

    }
}

if (document.getElementById('book-react')) {
    ReactDOM.render(<Book />, document.getElementById('book-react'));
}
