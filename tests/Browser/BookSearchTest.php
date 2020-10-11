<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class BookSearchTest extends DuskTestCase
{
    public function testWithoutInput()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/book')
                    ->waitFor('#isbn')
                    ->press('検索')
                    ->waitFor('.error')
                    ->assertSee('ISBNが正しく入力されていません');
        });
    }

    public function testInputIsNotIsbn()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/book')
                    ->waitFor('#isbn')
                    ->type('#isbn', 'hogehoge')
                    ->press('検索')
                    ->assertSee('ISBNが正しく入力されていません');
        });
    }

    public function testCannotFetchBookDataFromIsbn()
    {
        $this->browse(function (Browser $browser) {
            $cannnot_search_number = '9784297100338';
            $browser->visit('/book')
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
            $isbn = '9784297100339';
            $browser->visit('/book')
                    ->waitFor('#isbn')
                    ->type('#isbn', $isbn)
                    ->press('検索')
                    ->waitFor('.book')
                    ->assertSee('Docker/Kubernetes')
                    ->assertDontSee('本の投稿をする');      // 未認証のため見えない
        });
    }
}
