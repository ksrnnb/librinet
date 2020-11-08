<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;
use App\Book;
use App\User;
use App\Genre;

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

        // ジャンルを作成しておかないと削除時にエラーが出る。
        Genre::create(['name' => 'test_genre']);

        $this->post->createComment($user_id = $this->user->id, $message = 'test_comment_message');
        $this->path = '/comment/' . $this->post->uuid;
    }

    public function testDeletePostInHomePage()
    {
        $this->browse(function (Browser $browser) {
            $browser = $this->login($browser);

            $this->assertDeletePost($browser, '/home');
        });
    }

    public function testDeletePostInCommentPage()
    {
        $this->browse(function (Browser $browser) {
            $this->assertDeletePost($browser, $this->path);
        });
    }

    public function assertDeletePost(Browser $browser, string $path)
    {
        // 削除前はコメントできる
        $browser->visit($this->path)
                ->waitFor('#message')
                ->assertSee('コメントする');

        // 投稿の削除。コメントも見えない状態。
        $browser->visit($path)
                ->waitFor('.feed')
                ->press('.trash-btn')
                ->waitForText('削除しますか')
                ->press('はい')
                ->waitUntilMissing('.feed')
                ->refresh()
                ->waitFor('#subtitle')
                ->assertMissing('.feed');

        // 削除後に投稿がみつからないのを確認
        $browser->visit($this->path)
                ->waitFor('.error')
                ->assertSee('投稿がみつかりませんでした');
    }
}
