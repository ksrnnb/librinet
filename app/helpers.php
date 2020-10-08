<?php

use Illuminate\Support\Str;
use Illuminate\Support\Arr;
use App\Post;
use App\Comment;

if (! function_exists('extract_user_params')) {

    function extract_user_params($params)
    {
        $columns = [
            'id',
            'str_id',
            'name',
            'email',
            'image',
        ];

        $params = Arr::only($params, $columns);

        return $params;
    }
}

if (! function_exists('bad_request')) {
    
    function bad_request()
    {
        return response('Bad Request', 400);
    }
}

if (! function_exists('delete_feed_and_get_new_feed')) {

    function delete_feed_and_get_new_feed($uuid, $item)
    {
        $isUuid = Str::isUuid($uuid);

        if ($isUuid) {
            try {
                if ($item === 'post') {
                    Post::where('uuid', $uuid)->delete();
                } elseif ($item === 'comment') {
                    Comment::where('uuid', $uuid)->delete();
                } else {
                    throw new Exception();
                }
            } catch (Exception $e) {
                // 不正なアクセス
                return bad_request();
            }
        } else {
            // 不正なアクセス
            return bad_request();
        }

        $posts = Post::getPostsOfFollowingUsers(Auth::user());
        
        return $posts;
    }
}
