<?php


use Illuminate\Support\Facades\Route;


Route::get('/', function () {
    return view('welcome'); // Assume que 'welcome.blade.php' contém seu div #app e diretivas Vite
});


Route::fallback(function () {
    return view('welcome'); // Sua view Blade que carrega o React
});