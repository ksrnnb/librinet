<?php

use Illuminate\Database\Seeder;
use App\User;

class UserSeeder extends Seeder
{
    public static $users = [
        'shogo'  => ['name' => 'しょーご', 'image' => null],
        'shinji' => ['name' => 'しんじ' , 'image' => null],
        'eri'    => ['name' => 'えり'   , 'image' => null],
        'yui'    => ['name' => 'ゆい'   , 'image' => null],
        'guest'  => ['name' => 'ゲスト' , 'image' => null, 'str_id' => 'guest'],
    ];

    public function registerBookAndPost($user, $state, $message)
    {
        if ($state) {
            $user->books()
                ->save(factory(App\Book::class)->states($state)->make())
                ->registerPost($message);
        } else {
            $user->books()
                ->save(factory(App\Book::class)->make())
                ->registerPost($message);
        }
    }

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        foreach (self::$users as $state => $value) {
            $user = factory(User::class)->states($state)->create();
        }

        // factory(App\User::class, 5)
        //     ->create()
        //     ->each(function ($user) {
        //         $items = [
        //             ['state' => '', 'message' => '勉強になりました'],
        //             ['state' => 'Linux', 'message' => 'よかったです！'],
        //             ['state' => 'readouble', 'message' => '最高です！'],
        //             ['state' => 'Dick', 'message' => 'おもしろかった！'],
        //             ['state' => '1984', 'message' => '重い内容だった'],
        //         ];
                
        //         foreach ($items as $item) {
        //             $this->registerBookAndPost($user, $state = $item['state'], $message = $item['message']);
        //         }
        //     });
    }
}
