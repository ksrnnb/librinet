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
        // TODO: リファクタリングが必要。DRY原則
        //  Userを5人、BookとPostを5冊ずつ登録。
        factory(App\User::class, 5)->create()->each(function($user) {
            $user->books()->save(factory(App\Book::class)->make())
                    ->register_post('勉強になりました！');

            $user->books()->save(factory(App\Book::class)->states('php')->make())
                    ->register_post('これは良書です！');

            $user->books()->save(factory(App\Book::class)->states('readouble')->make())
                    ->register_post('最高です！');

            $user->books()->save(factory(App\Book::class)->states('Dick')->make())
                    ->register_post('おもしろい！');

            $user->books()->save(factory(App\Book::class)->states('1984')->make())
                    ->register_post('監視社会こわい');
        });
    }

}
