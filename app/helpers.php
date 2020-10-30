<?php

use Illuminate\Support\Str;
use Illuminate\Support\Arr;
use App\Post;
use App\Comment;
use Illuminate\Support\Facades\Storage;

if (! function_exists('upload_image_to_s3')) {

    /**
     * @param base64
     * @return url or null
     */
    function upload_image_s3($image, $directory = 'avatar/')
    {
        // $image
        // data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD…DLJKSDuixN7EsDpY3BJ23H4nE2y91I6KzEBurHBlK3uIuD//Z
        if (empty($image)) {
            return null;
        }
        // 画像が投稿された場合
        if (strpos($image, 'data:image') === 0) {
            // $matches = ['data:image/jpeg;base64,', 'jpeg']
            preg_match('/data:image\/(\w+);base64,/', $image, $matches);
            $extension = $matches[1];
    
            // ";base64,"より後ろの文字列をとってきてデコードする。
            $base64 = explode(';base64,', $image)[1];
            $base64 = str_replace(' ', '+', $base64);
            $decoded_image = base64_decode($base64);
    
            $path = $directory . Str::uuid() . '.' . $extension;
    
            Storage::disk('s3')->put($path, $decoded_image, 'public');
            $url = Storage::disk('s3')->url($path);
    
            return $url ?? null;

        // 既にユーザー画像を持っていて、更新していない場合
        } else {
            return $image;
        }
    }
}

if (! function_exists('extract_user_params')) {

    /**
     * @param array
     * @return array
     */
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
