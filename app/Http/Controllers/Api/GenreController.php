<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\EditGenreRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use App\Genre;
use App\User;

class GenreController extends Controller
{
    public function edit(EditGenreRequest $request)
    {
        $genres = $request->input('newGenres');
        
        $table = Genre::whereIn('id', array_keys($genres))->get();
        
        foreach ($table as $genre) {
            Gate::authorize('edit-genre', $genre);
            
            $name = $genres[$genre->id];

            $query = ['name' => $name];
            $genre->fill($query)->save();
        }

        $user = User::getParamsForApp(Auth::user()->str_id);

        return response()->json($user);
    }
}
