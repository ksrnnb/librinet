<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;
use App\User;
use App\Book;

class CreateBookTest extends DuskTestCase
{
    use DatabaseMigrations;

    protected $user;
    protected $credential;
    protected $isbn;
    protected $hasSetUp = false;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = Factory(User::class)->create();

        // design, docker, wrong ISBN
        $this->isbn = ['9784839955557', '9784297100339', '9784297100338'];

        $this->credential = [
            'str_id' => $this->user->str_id,
            'password' => config('app.guest_password')
        ];
    }

    public function testWithoutLogin()
    {
        $this->browse(function (Browser $browser) {
            $path = '/book/add/' . $this->isbn[0];

            $browser->visit($path)
                    ->waitForLocation('/')
                    ->assertSee('シェア');
        });
    }

    public function testWrongIsbn()
    {
        $this->browse(function (Browser $browser) {
            $path = '/book/add/' . $this->isbn[2];

            $browser = $this->login($browser);

            // 本が見つからない場合
            $browser->visit($path)
                    ->waitFor('.error')
                    ->assertSee('本がみつかりませんでした');

            // ISBNでない場合
            $browser->visit($path . 'test_wrong_link')
                    ->waitFor('.error')
                    ->assertSee('URLが正しくありません');
        });
    }

    public function testWithoutInput()
    {
        $this->browse(function (Browser $browser) {
            $path = '/book/add/' . $this->isbn[0];

            $browser->visit($path)
                    ->waitFor('#new-genre')
                    ->press('本棚に追加する')
                    ->waitFor('.error')
                    ->assertPathIs($path);
        });
    }

    public function testCanCreateBook()
    {
        $this->browse(function (Browser $browser) {
            $path = '/book/add/' . $this->isbn[0];
            // 新しいジャンル
            $browser->visit($path)
                    ->waitFor('#new-genre')
                    ->type('new-genre', 'TEST_GENRE')
                    ->press('本棚に追加する')
                    ->waitFor('.user-card')
                    ->assertSee('本棚');

            $path = '/book/add/' . $this->isbn[1];
            // 既存のジャンル
            $isbn = '9784297100339';
                    $browser->visit($path)
                    ->waitFor('#new-genre')
                    ->check('#conventional')
                    ->press('本棚に追加する')
                    ->waitFor('.user-card')
                    ->assertSee('本棚');
        });
    }
}
