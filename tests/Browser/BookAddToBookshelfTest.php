<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;
use App\User;
use App\Book;

class BookAddToBookshelfTest extends DuskTestCase
{
    public function deleteIfBookExist($isbns, $id)
    {
        foreach ($isbns as $isbn) {
            $books = Book::where('isbn', $isbn)->get();
            $book = $books->where('user_id', $id)->first();
        
            if ($book) {
                $book->delete();
            }
        }
    }

    public function testWithoutLogin()
    {
        $this->browse(function (Browser $browser) {
            $isbn = '9784297100339';                // docker
            $browser->visit('/book/add/' . $isbn)
                    ->assertPathIs('/');
        });
    }

    public function testWithoutInput()
    {
        $this->browse(function (Browser $browser) {
            $isbns = ['9784839955557', '9784297100339'];     // デザイン, Docker

            $user = User::where('str_id', 'guest')->first();
            $this->deleteIfBookExist($isbns, $user->id);

            $browser->loginAs($user)
                    ->visit('/book/show/' . $isbns[0])
                    ->press('本棚に追加する')
                    ->press('本棚に追加する')
                    ->assertPathIsNot('/book');     // NG ジャンルの未入力
        });
    }

    public function testWithInputNewGenre()
    {
        $this->browse(function (Browser $browser) {
            $isbn = '9784839955557';                // デザイン

            $browser->visit('/book/show/' . $isbn)
                    ->press('本棚に追加する')
                    ->type('new_genre', 'GENRE1')   // ジャンルの入力
                    ->press('本棚に追加する')
                    ->assertPathIs('/book');        // OK
        });
    }

    public function testWithConventionalGenre()
    {
        $this->browse(function (Browser $browser) {
            $isbn = '9784297100339';               // Docker

            $browser->visit('/book/show/' . $isbn)
                    ->press('本棚に追加する')
                    ->check('#conventional')
                    ->press('本棚に追加する')
                    ->assertPathIs('/book');        // OK
        });
    }
}
