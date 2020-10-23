<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;
use App\Book;
use App\User;

class DeletePostTest extends DuskTestCase
{
    use DatabaseMigrations;

    protected $user;
    protected $credential;
    protected $path;
    protected $post;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = Factory(User::class)->create();

        $this->credential = [
            'str_id' => $this->user->str_id,
            'password' => config('app.guest_password')
        ];

        $this->post = $this->user->books()
                                 ->save(factory(Book::class)->make())
                                 ->registerPost('test_post_message');

        $this->post->createComment($user_id = $this->user->id, $message = 'test_comment_message');
        $this->path = '/comment/' . $this->post->uuid;
    }

    public function testPostDelete()
    {
        $this->browse(function (Browser $browser) {
            $browser = $this->login($browser);

            // 削除前はコメントできる
            $browser->visit($this->path)
                    ->waitFor('#message')
                    ->assertSee('コメントする');

            // 投稿の削除。コメントも見えない状態。
            $browser->visit('/home')
                    ->waitFor('.feed')
                    ->press('.trash-icon')
                    ->waitUntilMissing('.feed')
                    ->refresh()
                    ->waitFor('#subtitle')
                    ->assertMissing('.feed');

            // 削除後に投稿がみつからないのを確認
            $browser->visit($this->path)
                    ->waitFor('.error')
                    ->assertSee('投稿がみつかりませんでした');
        });
    }

    // public function testCommentDelete()
    // {
    //         $this->browse(function (Browser $browser) {

    //             $comment = \App\Comment::where('user_id', self::$user->id)->first();
    //             $selector = '#del-' . $comment->uuid;

    //             $browser->loginAs(self::$user)
    //                 ->visit('/home')
    //                 ->press($selector)
    //                 ->assertMissing($selector);
 
    //         // TODO: 消した後につくるか、作ってから消す！！
    //         });
    // }
}
