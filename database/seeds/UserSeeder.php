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
                    ->registerPost('勉強になりました！');

            $user->books()->save(factory(App\Book::class)->states('php')->make())
                    ->registerPost('これは良書です！');

            $user->books()->save(factory(App\Book::class)->states('readouble')->make())
                    ->registerPost('最高です！');

            $user->books()->save(factory(App\Book::class)->states('Dick')->make())
                    ->registerPost('おもしろい！');

            $user->books()->save(factory(App\Book::class)->states('1984')->make())
                    ->registerPost('監視社会こわい');
        });
    }

}
