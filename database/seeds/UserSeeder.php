<?php

use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(App\User::class, 5)->create()->each(function($user) {
            $user->books()->save(factory(App\Book::class)->make());
            $user->books()->save(factory(App\Book::class)->states('php')->make());
            $user->books()->save(factory(App\Book::class)->states('readouble')->make());
        });
    }
}
