<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;
use App\User;
use App\Book;
use App\Post;

class CommentTest extends DuskTestCase
{
    use DatabaseMigrations;

    protected $user;
    protected $credential;
    protected $path;
    protected $isbn;
    protected $post;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = Factory(User::class)->create();

        $this->credential = [
            'str_id' => $this->user->str_id,
            'password' => config('app.guest_password')
        ];

        $this->user->books()
                ->save(factory(Book::class)->make())
                ->registerPost('TEST_MESSAGE');

        $this->post = Post::find(1);
        $this->path = '/comment/' . $this->post->uuid;
    }

    public function testCommentWithoutLogin()
    {
        $this->browse(function (Browser $browser) {
            // URL入力する場合
            $browser->visit($this->path)
                    ->waitForLocation('/home')
                    ->assertSee('ログイン');
        });
    }

    public function testCanAcessFromHomePage()
    {
        $this->browse(function (Browser $browser) {
            $browser = $this->login($browser);

            $browser->visit('/home')
                    ->waitFor('.feed')
                    ->press('.comment-icon')
                    ->assertSee('コメントする');
        });
    }

    public function testCannotAccessWithWrongUrl()
    {
        $this->browse(function (Browser $browser) {
            
            $browser->visit($this->path . 'test_wrong_url')
                    ->waitFor('.error')
                    ->assertSee('みつかりません');
        });
    }

    public function testCannotCommentWithoutInputComment()
    {
        $this->browse(function (Browser $browser) {
            
            $browser->visit($this->path)
                    ->waitFor('#message')
                    ->press('コメントする')
                    ->waitFor('.error')
                    ->assertSee('コメントが入力されていません');
        });
    }

    public function testCanComment()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit($this->path)
                    ->waitFor('#message')
                    ->type('message', 'test_comment')
                    ->press('コメントする')
                    ->waitForLocation('/home')
                    ->assertSee('test_comment');
        });
    }

    public function testCanCommentWithBook()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit($this->path)
                    ->waitFor('#message')
                    ->check('recommend')
                    ->type('message', 'test_comment_with_book')
                    ->press('コメントする')
                    ->waitForLocation('/home')
                    ->assertSee('test_comment_with_book');
        });
    }
}
