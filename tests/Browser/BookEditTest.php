<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;
use App\User;
use App\Book;
use App\Genre;

class BookEditTest extends DuskTestCase
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
        $this->book = $this->user
                           ->books()
                           ->save(factory(Book::class)->make());

        $this->genre = factory(Genre::class)->create(
            ['name' => 'TEST_GENRE']
        );
    }

    public function testCannotAccessEditPageWithoutAuth()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit($this->path)
                    ->waitForText('Profile')
                    ->assertSee('本がありません')
                    ->press('本を探す')
                    ->waitFor('#isbn')
                    ->assertSee('本の検索');
        });
    }

    public function testEditGenre()
    {
        $this->browse(function (Browser $browser) {
            $browser = $this->login($browser);
            $this->createBook();

            $browser->visit($this->path)
                    ->waitForText('Profile')
                    ->press('ジャンルを編集する');
            
            $ini_genre = $browser->attribute('.genres', 'value');
            $new_genre = 'TEST-GENRE';

            $browser->type('.genres', $new_genre)
                    ->press('編集する')
                    ->waitForText('Profile')
                    ->assertSee($new_genre);
        });
    }

    public function testDoesntDeleteBookWithoutCheck()
    {
        $this->browse(function (Browser $browser) {
            $this->createBook();

            $browser->visit($this->path)
                    ->waitForText('Profile')
                    ->press('本を削除する')
                    ->waitFor('.select-book-card')
                    ->press('削除する')
                    ->waitForDialog()
                    ->assertDialogOpened('本が選択されていません')
                    ->acceptDialog()
                    ->assertDontSee('Profile');
        });
    }

    public function testDeleteFromBookshelf()
    {
        $this->browse(function (Browser $browser) {
            $this->createBook();

            $browser->visit($this->path)
                    ->waitForText('Profile')
                    ->press('本を削除する')
                    ->waitFor('.select-book-card')
                    ->click('.select-book-card')
                    ->press('削除する')
                    ->waitForText('Profile')
                    ->assertSee('本がありません');
        });
    }
}
