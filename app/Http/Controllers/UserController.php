<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request, $str_id) {
        return view('user', ['str_id' => $str_id]);
    }
}
