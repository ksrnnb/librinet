<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;
use App\User;
use App\Genre;
use App\Book;

class DeleteBookTest extends DuskTestCase
{
    use DatabaseMigrations;

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

    public function testCannotAccessDeletePageDirectlyWhenIsNotAuthenticated()
    {
        $this->browse(function (Browser $browser) {
            $delete_path = '/book/delete/' . $this->user->str_id;
            $browser->visit($delete_path)
                    ->waitForLocation('/')
                    ->assertSee('ゲストユーザーでログイン');
        });
    }

    public function testCannotAccessDeletePageDirectlyWhenDoesntHaveAnyBooks()
    {
        $this->browse(function (Browser $browser) {
            $browser = $this->login($browser);
            $delete_path = '/book/delete/' . $this->user->str_id;

            $browser->visit($delete_path)
                    ->waitForLocation($this->path)
                    ->assertSee('本がありません');
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

    public function testCannotDeleteBookOfOtherUser()
    {
        $this->browse(function (Browser $browser) {
            $other_user = Factory(User::class)->create();
            $delete_path = '/book/delete/' . $other_user->str_id;
            $profile_path = '/user/profile/' . $other_user->str_id;

            $browser->visit($delete_path)
                    ->waitForLocation($profile_path)
                    ->waitFor('.my-card')
                    ->assertSee('本棚');
        });
    }
}
