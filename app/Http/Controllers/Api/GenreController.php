<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Genre;

class GenreController extends Controller
{
    public function edit(Request $request)
    {
        if (Auth::id() == $request->input('userId')) {
            $genres = $request->input('newGenres');

            $is_empty = (! $genres) || array_search(null, $genres);

            if ($is_empty) {
                return bad_request();
            }

            $table = Genre::whereIn('id', array_keys($genres))->get();

            foreach ($table as $genre) {
                $name = $genres[$genre->id];

                $query = ['name' => $name];
                $genre->fill($query)->save();
            }
            
            return response('updated', 200);
        } else {
            // 認証されているIDと編集しようとしているIDが違う場合
            return bad_request();
        }
    }
}
