<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;
use App\User;

class SearchBookTest extends DuskTestCase
{
    use DatabaseMigrations;

    protected $user;
    protected $credential;
    protected $path;
    protected $isbn;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = Factory(User::class)->create();

        $this->credential = [
            'str_id' => $this->user->str_id,
            'password' => config('app.guest_password')
        ];

        $this->path = '/book';
        $this->isbn = '9784297100339';
    }

    public function testWithoutInput()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit($this->path)
                    ->waitFor('#isbn')
                    ->press('検索')
                    ->waitFor('.error')
                    ->assertSee('ISBNが正しく入力されていません');
        });
    }

    public function testInputIsNotIsbn()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit($this->path)
                    ->waitFor('#isbn')
                    ->type('#isbn', 'test_wrong_input')
                    ->press('検索')
                    ->waitFor('.error')
                    ->assertSee('ISBNが正しく入力されていません');
        });
    }

    public function testCannotFetchBookDataFromIsbn()
    {
        $this->browse(function (Browser $browser) {
            $cannnot_search_number = '9784297100338';
            $browser->visit($this->path)
                    ->waitFor('#isbn')
                    ->type('#isbn', $cannnot_search_number)
                    ->press('検索')
                    ->waitFor('.error')
                    ->assertSee('本が見つかりませんでした');
        });
    }

    public function testCanFetchBookDataFromIsbnAndDontSeePostButton()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit($this->path)
                    ->waitFor('#isbn')
                    ->type('#isbn', $this->isbn)
                    ->press('検索')
                    ->waitFor('.book-card')
                    ->assertSee('Docker/Kubernetes')
                    ->assertDontSee('投稿をする')      // 未認証のため見えない
                    ->assertDontSee('追加する');      // 未認証のため見えない
        });
    }

    public function testCanFetchBookDataPressingEnterKey()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit($this->path)
                    ->waitFor('#isbn')
                    ->keys('#isbn', $this->isbn, '{enter}')
                    ->press('検索')
                    ->waitFor('.book-card')
                    ->assertSee('Docker/Kubernetes');
        });
    }

    // Postに関連する箇所でDuskエラーが出る？
    // public function testLinkToPostAndAddBookPageAfterAuthenticated()
    // {
    //     $this->browse(function (Browser $browser) {
    //         $isbn = '9784297100339';
    //         $browser = $this->login($browser);

    //         $browser->visit($this->path)
    //                 ->waitFor('#isbn')
    //                 ->type('#isbn', $this->isbn)
    //                 ->press('検索')
    //                 ->waitFor('.book-card')
    //                 ->press('投稿する')
    //                 ->waitFor('#message')
    //                 ->assertSee('投稿画面')
    //                 ->back()
    //                 ->waitFor('#isbn');

    //         $browser->type('#isbn', $this->isbn)
    //                 ->press('検索')
    //                 ->waitFor('.book-card')
    //                 ->press('本棚に追加する')
    //                 ->waitFor('#new-genre')
    //                 ->assertSee('ジャンル')
    //                 ->back()
    //                 ->waitFor('#isbn')
    //                 ->assertSee('本の検索');
    //     });
    // }
}
