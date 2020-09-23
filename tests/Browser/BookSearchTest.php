<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class BookSearchTest extends DuskTestCase
{

    public function testWithoutInputPressSearchButton()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/')
                    ->press('#guest')
                    ->visit('/book')
                    ->press('検索')
                    ->assertSee('本の検索');
        });
    }

    public function testInputIsNotIsbn()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/book')
                    ->type('#isbn', 'hogehoge')
                    ->press('検索')
                    ->assertSee('正しいISBN');
        });
    }

    public function testCannotFetchBookDataFromIsbn()
    {
        $this->browse(function (Browser $browser) {
            $cannnot_search_number = '9784297100338';
            $browser->visit('/book')
                    ->type('#isbn', $cannnot_search_number)
                    ->press('検索')
                    ->waitFor('.error')      // デフォルトで最大5秒待つ
                    ->assertSee('本が見つかりません');
        });
    }

    public function testCanFetchBookDataFromIsbnAndCanBackSearchPage()
    {
        $this->browse(function (Browser $browser) {
            $isbn = '9784297100339';
            $browser->visit('/book')
                    ->type('#isbn', $isbn)
                    ->press('検索')
                    ->waitFor('.book')
                    ->assertSee('Docker/Kubernetes');
        });
    }

    // public function testCanAccessPostPageAndCanBackBookPage()
    // {
    //     $this->browse(function (Browser $browser) {
    //         $isbn = '9784297100339';
    //         $browser->visit('/book/show/' . $isbn)
    //                 ->press('本の投稿をする')
    //                 ->back()
    //                 ->press('本の検索画面に戻る')
    //                 ->assertPathIs('/book');
    //     });
       
    // }
}
