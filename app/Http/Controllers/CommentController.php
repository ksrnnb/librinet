<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Comment;

class CommentController extends Controller
{
    public function remove(Request $request, $uuid)
    {
        if (Str::isUuid($uuid)) {
            $comment = Comment::where('uuid', $uuid)->first();

            if ($comment) {
                $comment->delete();
            } else {
                abort('400');
            }
        }
        return back();
    }
}
