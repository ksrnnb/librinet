<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\User;
use Faker\Generator as Faker;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| This directory should contain each of the model factory definitions for
| your application. Factories provide a convenient way to generate new
| model instances for testing / seeding your application's database.
|
*/

$factory->define(User::class, function (Faker $faker) {
    return [
        'name' => $faker->username,
        'str_id' => $faker->unique()->regexify('[a-zA-Z0-9]{6,10}'),
        'email' => $faker->unique()->safeEmail,
        'email_verified_at' => now(),
        // 'image' => asset('img/icon.svg'),    <- このやり方だと、localhost/img/icon.svgになってしまう
        'password' => Hash::make(env('GUEST_PASSWORD')),
        'remember_token' => Str::random(10),
    ];
});