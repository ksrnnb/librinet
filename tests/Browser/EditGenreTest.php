<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;
use App\User;
use App\Book;
use App\Genre;

class EditGenreTest extends DuskTestCase
{
    use DatabaseMigrations;

    protected $user;
    protected $credential;
    protected $book;
    protected $path;
    protected $genre;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = Factory(User::class)->create();

        $this->credential = [
            'str_id' => $this->user->str_id,
            'password' => config('app.guest_password')
        ];

        $this->path = '/user/profile/' . $this->user->str_id;
    }

    public function createBook()
    {
        $genre = Genre::create(
            ['name' => 'TEST_GENRE']
        );

        $this->user
             ->books()
             ->save(factory(Book::class)->make());
    }

    public function testCannotAccessEditPageWithoutAuth()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit($this->path)
                    ->waitForText('プロフィール')
                    ->assertSee('本がありません')
                    ->press('本を探す')
                    ->waitFor('#isbn')
                    ->assertSee('本の検索');

            // 直接URLを入力してもトップページに戻す。
            $edit_path = '/genre/edit/' . $this->user->str_id;
            $browser->visit($edit_path)
                    ->waitForLocation('/')
                    ->assertSee('ゲストユーザーでログイン');
        });
    }

    public function testCannotAccessDirectlyWhenDoesntHaveAnyBooks()
    {
        $this->browse(function (Browser $browser) {
            $browser = $this->login($browser);

            $edit_path = '/genre/edit/' . $this->user->str_id;

            $browser->visit($edit_path)
                    ->waitForLocation($this->path)
                    ->assertSee('本がありません');
        });
    }

    public function testCannotEditGenreOfOtherUser()
    {
        $this->browse(function (Browser $browser) {
            $browser = $this->login($browser);

            $other_user = Factory(User::class)->create();
            $edit_path = '/genre/edit/' . $other_user->str_id;
            $profile_path = '/user/profile/' . $other_user->str_id;

            $browser->visit($edit_path)
                    ->waitForLocation($profile_path)
                    ->waitFor('.my-card')
                    ->assertSee('本棚');
        });
    }

    public function testEditGenre()
    {
        $this->browse(function (Browser $browser) {
            $this->createBook();

            $browser->visit($this->path)
                    ->waitForText('フォロー')
                    ->press('.dropdown-toggle')
                    ->press('ジャンルを編集する');
            
            $ini_genre = $browser->attribute('.genre', 'value');
            $new_genre = 'TEST-GENRE';

            $browser->type('genre', $new_genre)
                    ->scrollIntoView('.btn-outline-success')
                    ->press('編集する')
                    ->waitForText('フォロー')
                    ->assertSee($new_genre);
        });
    }
}
