<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class LandingController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()) {
            return redirect()->route('dashboard');
        }

        return Inertia::render('Landing');
    }
}
