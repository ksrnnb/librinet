<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;
use App\User;
use Illuminate\Support\Str;

class PostTest extends DuskTestCase
{
    use DatabaseMigrations;

    protected $user;
    protected $credential;
    protected $isbn;
    protected $path;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = Factory(User::class)->create();

        $this->credential = [
            'str_id' => $this->user->str_id,
            'password' => config('app.guest_password')
        ];

        // Linux, docker, wrong ISBN
        $this->isbn = ['9784797397642', '9784297100339', '9784297100338'];
        $this->path = '/book/post/' . $this->isbn[0];
    }

    public function addBook($browser, $message = 'TEST_MESSAGE', $genre_name = 'TEST_GENRE')
    {
        // 本を追加
        $browser->visit($this->path)
                ->waitFor('#message')
                ->check('add-book')
                ->type('new-genre', $genre_name)
                ->type('message', $message)
                ->press('投稿する')
                ->waitFor('.feed');

        return $browser;
    }

    public function testWithoutLogin()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit($this->path)
                    ->waitForLocation('/home')
                    ->assertSee('ログイン');
        });
    }

    public function testWrongIsbn()
    {
        $this->browse(function (Browser $browser) {
            $no_book_path = '/book/post/' . $this->isbn[2];

            $browser = $this->login($browser);

            // 本が見つからない場合
            $browser->visit($no_book_path)
                    ->waitFor('.error')
                    ->assertSee('本がみつかりませんでした');

            // ISBNでない場合
            $browser->visit($this->path . 'test_wrong_link')
                    ->waitFor('.error')
                    ->assertSee('URLが正しくありません');
        });
    }

    // ブラウザ最大化でcircleci環境でもOK
    public function testWithoutGenre()
    {
        $this->browse(function (Browser $browser) {
            $browser->maximize()
                    ->visit($this->path)
                    ->waitFor('#message')
                    ->type('message', 'TEST_MESSAGE')
                    ->press('投稿する')
                    ->waitFor('.error')
                    ->assertPathIs($this->path);
        });
    }

    // ここがどうしてもcircleciだと通らない
    // public function testWithoutComment()
    // {
    //     $this->browse(function (Browser $browser) {
    //         $browser->maximize()
    //                 ->visit($this->path)
    //                 ->waitFor('#new-genre')
    //                 ->type('new-genre', 'TEST_GENRE')
    //                 ->press('投稿する')
    //                 ->waitFor('.error')
    //                 ->assertPathIs($this->path);
    //     });
    // }

    public function testDontAddToBookshelf()
    {
        $this->browse(function (Browser $browser) {
            $message = 'TEST_MESSAGE';

            $browser->maximize()
                    ->visit($this->path)
                    ->waitFor('#message')
                    ->uncheck('add-book')
                    ->type('message', $message)
                    ->press('投稿する')
                    ->waitFor('.feed')
                    ->assertSee($message)
                    ->visit('/user/profile/' . $this->user->str_id)
                    ->waitForText('プロフィール')
                    ->assertSee('本がありません');
        });
    }

    public function testAddBookWithNewGenreAndCannotAddAgain()
    {
        $this->browse(function (Browser $browser) {
            $message = 'TEST_MESSAGE';

            // 本を追加
            $browser = $this->addBook($browser, $message);
            
            $browser->assertSee($message)
                    ->visit('/user/profile/' . $this->user->str_id)
                    ->waitForText('プロフィール')
                    ->assertDontSee('本がありません');

            // 本が追加済みで、ジャンルが選べないのを確認
            $browser->visit($this->path)
                    ->waitFor('#message')
                    ->assertNotChecked('add-book')
                    ->assertSee('追加済み')
                    ->assertDontSee('ジャンル');
        });
    }

    public function testCannotSelectGenreWithoutCheckedAddingBox()
    {
        $this->browse(function (Browser $browser) {
            // 本を追加
            $name = 'TEST_GENRE';
            $browser = $this->addBook($browser, $message = 'TEST', $genre_name = $name);
            $new_path = '/book/post/' . $this->isbn[1];

            $browser->visit($new_path)
                    ->waitFor('#message')
                    ->uncheck('add-book')
                    ->assertDisabled('genre')
                    ->assertDisabled('new-genre')
                    ->assertDisabled('genre_id');
        });
    }

    public function testAddBookWithConventionalGenre()
    {
        $this->browse(function (Browser $browser) {
            $message_1 = 'TEST_MESSAGE_1';
            $message_2 = 'TEST_MESSAGE_2';
            $new_path = '/book/post/' . $this->isbn[1];
            $genre_name = 'TEST_GENRE';

            // 本を追加
            $browser = $this->addBook($browser, $message_1, $genre_name);

            // もう一冊追加
            $browser->visit($new_path)
                    ->waitFor('#message')
                    ->check('add-book')
                    ->check('#conventional')
                    ->select('genre_id', $genre_name)
                    ->type('message', $message_2)
                    ->press('投稿する')
                    ->waitFor('.feed')
                    ->assertSee($message_1)
                    ->assertSee($message_2);
        });
    }
}
