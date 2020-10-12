<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;
use App\User;
use App\Follower;
use App\Book;
use Illuminate\Support\Facades\Auth;

class LikeTest extends DuskTestCase
{
    /**
     * check like funciton
     */
    use DatabaseMigrations;

    protected $user1;
    protected $user2;
    protected $has_created;
    protected $credential;

    protected function setUp(): void
    {
        parent::setUp();
        if (!$this->has_created) {
            $this->has_created = true;
            
            $this->user1 = Factory(User::class)->create();
            $this->user2 = Factory(User::class)->create();

            $this->user2->books()
                        ->save(factory(Book::class)->make())
                        ->registerPost('test-message');

            $this->credential = [
                'str_id' => $this->user1->str_id,
                'password' => config('app.guest_password')
            ];

            Follower::create([
                'follow_id' => $this->user2->id,
                'follower_id' => $this->user1->id,
            ]);
        }
    }
    
    public function testLike()
    {
        // TODO: ログインがうまく動作していない。Sanctumの問題？
        // ログイン画面を実装する必要がある？
        // $this->authenticate();

        $this->browse(function (Browser $browser) {

            $str_id = $this->credential['str_id'];
            $password = $this->credential['password'];

            $browser->visit('/login')
                    ->waitFor('#user-id')
                    ->type('user-id', $str_id)
                    ->type('password', $password)
                    ->press('#normal-login')
                    // ->visit('/book/post/9784297100339')
                    ->waitFor('.feed');

            dump($str_id);


            // $ini = $browser->attribute('.count', 'data-count');
            
            // $browser->press('いいね')
            //         ->pause(100);       // データベースの書き込みのため少し待つ

            // // 増えた or 減った
            // $count = $browser->attribute('.count', 'data-count');
            // $this->assertEquals($count, ($ini + 1) % 2);
            
            // // ページ再読み込みして変わらないのを確認
            // $browser->refresh();
            // $count = $browser->attribute('.count', 'data-count');
            // $this->assertEquals($count, ($ini + 1) % 2);
        
            // // もう一回いいね押す
            // $browser->press('いいね')
            //         ->pause(100);       // データベースの書き込みのため少し待つ


            // // 減った or 増えた
            // $count = $browser->attribute('.count', 'data-count');
            // $this->assertEquals($count, $ini % 2);
            
            // // ページ再読み込みして変わらないのを確認
            // $browser->refresh();
            // $count = $browser->attribute('.count', 'data-count');
            // $this->assertEquals($count, $ini % 2);
        });
    }
}
