<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Genre;
use App\User;

class GenreController extends Controller
{
    public function edit(Request $request)
    {
        $user = Auth::user();

        if ($user->id == $request->input('userId')) {
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

            $user = User::getParamsForApp($user->str_id);

            return response()->json($user);
        } else {
            // 認証されているIDと編集しようとしているIDが違う場合
            return bad_request();
        }
    }
}
