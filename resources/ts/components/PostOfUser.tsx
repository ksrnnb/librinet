import React, { useState } from 'react';
import { Post } from '../types/Interfaces';
import { ModalWindow } from '../views/Home';
import Feed from './Feed';

interface PostsProps extends Props {
    onClickDelete: (e: any) => void;
}

function Posts(props: PostsProps) {
    const { posts, viewerId, onClickDelete } = props;

    const postsElement = posts.map((post: Post) => {
        return (
            <Feed
                item={post}
                viewerId={viewerId}
                onClickDelete={onClickDelete}
                key={post.id}
            // linkToComment={linkToComment}
            />
        );
    });

    return <>{postsElement}</>;
}

interface Props {
    posts: Post[];
    viewerId: number;
}

export function PostOfUser(props: Props) {
    const { posts, viewerId } = props;
    const [show, setShow] = useState<boolean>(false);
    const [uuid, setUuid] = useState<string | null>(null);

    const handleClose = () => {
        setShow(false);
        setUuid(null);
    };

    const handleShow: (e: any) => void = (e: any) => {
        setShow(true);
        setUuid(e.target.dataset.uuid);
    };

    return (
        <>
            <Posts posts={posts} viewerId={viewerId} onClickDelete={handleShow} />
            <ModalWindow
                show={show}
                handleClose={handleClose}
                uuid={uuid}
                isPost="true" // 文字列で判定しているので注意
            />
        </>
    );
}
