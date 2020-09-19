<?php

use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    
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
        
        //  Userを5人、BookとPostを5冊ずつ登録。
        factory(App\User::class, 5)
            ->create()
            ->each(function($user) {
                $items = [
                    ['state' => '', 'message' => '勉強になりました'],
                    ['state' => 'Linux', 'message' => 'よかったです！'],
                    ['state' => 'readouble', 'message' => '最高です！'],
                    ['state' => 'Dick', 'message' => 'おもしろかった！'],
                    ['state' => '1984', 'message' => '重い内容だった'],
                ];
                
                foreach ($items as $item) {
                    $this->registerBookAndPost($user, $state = $item['state'], $message = $item['message']);
                }
            });

        // GUEST USER
        App\User::create([
            'str_id' => 'guest',
            'name' => 'ゲスト',
            'email' => 'guest@guest.com',
            'email_verified_at' => now(),
            'image' => '/img/icon_green.svg',
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            'remember_token' => Str::random(10),
        ]);
    }

}
