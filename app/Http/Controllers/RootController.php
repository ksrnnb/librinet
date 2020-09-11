<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RootController extends Controller
{
    public function index(Request $requset)
    {
        if (Auth::check()) {
            return redirect('/home');
        } else {
            return view('root');
        }
    }

    public function guest (Request $requset)
    {

        return redirect('/home');
    }
}
