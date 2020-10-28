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
                    ->waitForText('プロフィール')
                    ->assertSee('本がありません')
                    ->press('本を探す')
                    ->waitFor('#isbn')
                    ->assertSee('本の検索');
        });
    }

    public function testEditGenre()
    {
        $this->browse(function (Browser $browser) {
            $browser = $this->login($browser);
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

    public function testDoesntDeleteBookWithoutCheck()
    {
        $this->browse(function (Browser $browser) {
            $this->createBook();

            $browser->visit($this->path)
                    ->waitForText('フォロー')
                    ->press('.dropdown-toggle')
                    ->press('本を削除する')
                    ->waitFor('.delete-book-card')
                    ->press('削除する')
                    ->waitForText('削除しますか')
                    ->press('はい')
                    ->waitForDialog()
                    ->assertDialogOpened('本が選択されていません')
                    ->acceptDialog()
                    ->assertDontSee('フォロー');
        });
    }

    public function testDeleteFromBookshelf()
    {
        $this->browse(function (Browser $browser) {
            $this->createBook();

            $browser->visit($this->path)
                    ->waitForText('フォロー')
                    ->press('.dropdown-toggle')
                    ->press('本を削除する')
                    ->waitFor('.delete-book-card')
                    ->click('.delete-book-card')
                    ->press('削除する')
                    ->waitForText('削除しますか')
                    ->press('はい')
                    ->waitForText('フォロー')
                    ->assertSee('本がありません');
        });
    }
}
