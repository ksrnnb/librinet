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
        //  Userを5人、BookとPostを3冊ずつ登録。
        factory(App\User::class, 5)->create()->each(function($user) {
            $user->books()->save(factory(App\Book::class)->make())
                    ->register_post('勉強になりました！');

            $user->books()->save(factory(App\Book::class)->states('php')->make())
                    ->register_post('これは良書です！');

            $user->books()->save(factory(App\Book::class)->states('readouble')->make())
                    ->register_post('最高です！');
        });
    }

}
