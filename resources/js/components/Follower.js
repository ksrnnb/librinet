import React from 'react';
import ReactDOM from 'react-dom';
const axios = window.axios;

class Follower extends React.Component {

    constructor(props) {
        super(props);
        const isFollowing = document.getElementById('is_following').value == 1; // 0 or 1
        this.state = {
            isFollowing: isFollowing,
        };

        this.handleClick = this.handleClick.bind(this);
        this.follower_id = document.getElementById('follower_id').value;
        this.follow_id = document.getElementById('follow_id').value;
    }

    handleClick () {
        const isFollowing = this.state.isFollowing;

        const action = isFollowing ? 'unfollow' : 'follow';

        axios.post('/follow', {
              follow_id: this.follow_id,
            follower_id: this.follower_id,
                 action: action,
        })
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.log(error);
        });

        this.setState({
            isFollowing: ! isFollowing,
        });
    }

    render() {    

        

        const isFollowing = this.state.isFollowing;

        if (isFollowing) {
            return  <button className="btn btn-info" name="action" onClick={this.handleClick}>フォロー中</button>;
        } else {
            return <button className="btn btn-outline-info" name="action" onClick={this.handleClick}>フォローする</button>;
        }
    }
}

if (document.getElementById('follower-react')) {
    ReactDOM.render(<Follower />, document.getElementById('follower-react'));
}
