import React from 'react';
import ReactDOM from 'react-dom';

export default Home;

function Home() {
    return     (
            <div className="row">
                <a href="/api/guest/login">
                    <button id="guest" className="btn btn-outline-success">
                        ゲストでログイン
                    </button>
                </a>
            </div>
    );
}
