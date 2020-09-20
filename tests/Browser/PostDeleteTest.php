<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class PostDeleteTest extends DuskTestCase
{

    public static $user;



    public function testPostDelete()
    {
        $this->browse(function (Browser $browser) {
            // user_id = 5のテストユーザー
            self::$user = \App\User::with('books')->get()->where('id', 5)->first();

            $post = \App\Post::where('user_id', self::$user->id)->first();
            $selector = '#del-' . $post->uuid;

            $browser->loginAs(self::$user)
                    ->visit('/home')
                    ->press($selector)
                    ->assertMissing($selector);

            // 関連づくコメントもないことを確認
            $this->assertTrue(\App\Comment::where('post_id', $post->id)->get()->isEmpty());
        });
    }

    public function testCommentDelete()
    {
            $this->browse(function (Browser $browser) {

            $comment = \App\Comment::where('user_id', self::$user->id)->first();
            $selector = '#del-' . $comment->uuid;

            dd($comment);

            $browser->loginAs(self::$user)
                    ->visit('/home')
                    ->press($selector)
                    ->assertMissing($selector);
 
            // TODO: 消した後につくるか、作ってから消す！！
        });
    }
}
