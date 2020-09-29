import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header';
import Book from './Book';
import Home from './Home';
import User from './User';
import Profile from './Profile';
import Login from './Login';
import Logout from './Logout';


import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

const axios = window.axios;

function SubColumn(props) {

    const userUrl = props.userUrl;
    let profileAndLogoutLink = null;
    if (userUrl) {
        profileAndLogoutLink = (
            <>
            <Link to={{pathname: userUrl, state: {user: props.user, authStrId: props.user.str_id}}}>
                <h4 className="mt-4">プロフィール</h4>
            </Link>
            <Link to="/logout">
                <h4 className="mt-4">ログアウト</h4>
            </Link>
            </>
        );
    }

    return (
            <div className="sub-column border-right">
                <Link to="/home">
                    <h4>ホーム</h4>
                </Link>

                <Link to="/book">
                    <h4 className="mt-4">本を検索する</h4>
                </Link>

                <Link to="/user/search">
                    <h4 className="mt-4">ユーザーを検索する</h4>
                </Link>
                {profileAndLogoutLink}

            </div>
    );
}

class App extends React.Component {

    constructor() {
        super();

        
        // windowサイズが800px以上であればカラムを表示
        this.maxWidth = 800;
        const isVisible = window.innerWidth > this.maxWidth ? true : false;

        // TODO：非同期だからUndefined そもそも必要？
        const user = this.authenticatedUser();
        const isLogin = user !== null;

        this.state = {
            isVisible: isVisible,
            isLogin: isLogin,
            user: user,
        }
    }
    
    componentDidMount() {
        this.windowSizeChange.call(this);
    }


    authenticatedUser() {
        axios.get('/api/user/auth')
        .then(response => {
            // TODO: Loginしていないときは？
            // response.data
            //     5: {id: 5, name: ゲスト, ....}
            const user = Object.values(response.data)[0];
            this.setState({
                isLogin: true,
                user: user,
            });
        })
        .catch(error => {
            alert('error happened getting auth user');
        });
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

    render() {

        const appName = document.title;
        let url;
        if (this.state.user) {
            url = '/user/profile/' + this.state.user.str_id;
        } else {
            url = null;
        }

        if (this.state.isVisible) {
            return (
                <Router >
                    <div className="container">
                        <Header userUrl={url} app={appName} hasHamburger={false} />
                        <SubColumn userUrl={url} user={this.state.user}/>
                        <div className="container ml-300">
                            <Switch>
                                <Route path="/home" component={Home} />
                                <Route path="/book" component={Book} />
                                <Route path="/user/search" component={User} />
                                <Route path="/user/profile/:strId" component={Profile} />
                                <Route path="/login" component={Login} />
                                <Route path="/logout" component={Logout} />
                            </Switch>
                        </div>
                    </div>
                </Router>
            );
            
        } else {
            return (
                <Router >
                    <div className="container">
                        <Header userUrl={url} app={appName} hasHamburger={true} />
                        <div className="container">
                            <Switch>
                                <Route path="/home" component={Home} />
                                <Route path="/book" component={Book} />
                                <Route path="/user/search" component={User} />
                                <Route path="/user/profile/:strId" component={Profile} />
                                <Route path="/login" component={Login} />
                                <Route path="/logout" component={Logout} />
                            </Switch>
                        </div>
                    </div>
                </Router>
            );
        }
    }
}

if (document.getElementById('app')) {
    ReactDOM.render(<App />, document.getElementById('app'));
}