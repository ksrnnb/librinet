import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header';

// import {
//     BrowserRouter as Router,
//     Switch,
//     Route,
//     Link
//   } from "react-router-dom";

const axios = require('axios');

function App() {
    return (
        // <Router >
        <>
        <Header userUrl='hoge' app="hoge"/>
        <div className="container">
            <p>hoge</p>
        </div>
        </>

        // </Router>
    );
}

if (document.getElementById('app')) {
    ReactDOM.render(<App />, document.getElementById('app'));
}