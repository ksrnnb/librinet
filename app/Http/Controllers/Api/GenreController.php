<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use App\Genre;
use App\User;

class GenreController extends Controller
{
    public function edit(Request $request)
    {
        $user = Auth::user();

        $genres = $request->input('newGenres');
        
        // TODO: validationを分離
        $is_empty = (! $genres) || array_search(null, $genres);
        
        if ($is_empty) {
            return bad_request();
        }
        
        $table = Genre::whereIn('id', array_keys($genres))->get();
        
        foreach ($table as $genre) {
            Gate::authorize('edit-genre', $genre);
            
            $name = $genres[$genre->id];

            $query = ['name' => $name];
            $genre->fill($query)->save();
        }

        $user = User::getParamsForApp($user->str_id);

        return response()->json($user);
    }
}
