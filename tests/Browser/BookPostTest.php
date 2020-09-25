<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;
use App\User;
use Illuminate\Support\Str;

class BookPostTest extends DuskTestCase
{

    public function createNewUser()
    {
        $user = User::create([
            'str_id' => Str::random(10),
            'name' => 'テストユーザー',
            'email' => Str::random(6) . '@test.com',
            'email_verified_at' => now(),
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            'remember_token' => Str::random(10),
        ]);

        return $user;
    }

    public function testWithoutLogin()
    {
        $this->browse(function (Browser $browser) {
            $isbn = '9784297100339';
            $browser->visit('/book/post/' . $isbn)
                    ->assertPathIs('/');
        });
    }

    public function testNoComment()
    {
        $this->browse(function (Browser $browser) {
            $isbn = '9784297100339';    // Docker
            $user = $this->createNewUser();

            $browser->loginAs($user)
                    ->visit('/book/post/' . $isbn)
                    ->assertSee('Docker')
                    ->check('add-book')
                    ->type('new_genre', 'Infrastructure')
                    ->press('投稿する')
                    ->assertSee('Docker');
        });
    }

    public function testNoGenreInput()
    {
        $this->browse(function (Browser $browser) {
            $isbn = '9784297100339';    // Docker
            $message = 'なかなかいいと思います！';

            $browser->visit('/book/post/' . $isbn)
                    ->assertSee('Docker')
                    ->check('add-book')
                    ->type('message', $message)
                    ->press('投稿する')
                    ->assertSee('Docker');
        });
    }

    public function testDontAddToBookshelf()
    {
        $this->browse(function (Browser $browser) {
            $isbn = '9784297100339';    // Docker
            $message = 'なかなかいいと思います！';

            $browser->visit('/book/post/' . $isbn)
                    ->uncheck('add-book')
                    ->type('message', $message)
                    ->press('投稿する')
                    ->assertPathIs('/home')
                    ->assertSee($message);
        });
    }

    public function testAddToBookshelfWithNewGenre()
    {
        $this->browse(function (Browser $browser) {
            $isbn = '9784297100339';    // Docker
            $message = 'なかなかいいと思います！';

            $browser->visit('/book/post/' . $isbn)
                    ->assertDontSee('既存')         // 新規ユーザーはまだ本が未登録なのでみえない
                    ->check('add-book')
                    ->type('new_genre', 'Infrastructure')
                    ->type('message', $message)
                    ->press('投稿する')
                    ->assertPathIs('/home')
                    ->assertSee($message);
        });
    }

    public function testAddToBookshelfWithConventionalGenre()
    {
        $this->browse(function (Browser $browser) {
            $isbn = '9784822283117';    // ネットワーク
            $message = 'ネットワークの勉強になりました';

            $browser->visit('/book/post/' . $isbn)
                    ->check('add-book')
                    ->check('#conventional')
                    ->select('genre_id', 'Infrastructure')
                    ->type('message', $message)
                    ->press('投稿する')
                    ->assertPathIs('/home')
                    ->assertSee($message);
        });
    }

    public function testCannotSelectAddBookWhenBookIsAlreadyInBookshelf()
    {
        $this->browse(function (Browser $browser) {
            $isbn = '9784297100339';    // Docker

            $browser->visit('/book/post/' . $isbn)
                    ->assertDontSee('ジャンルの選択')
                    ->assertAttribute('#add-book', 'disabled', 'true');
        });
    }
}
