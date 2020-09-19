<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class BookEditTest extends DuskTestCase
{

    private static $user;
    private static $user_url;

    public function testEditGenre()
    {
        $this->browse(function (Browser $browser) {
            // user_id = 5のテストユーザー
            self::$user = \App\User::with('books')->get()->where('id', 5)->first();
            self::$user_url = '/user/' . self::$user->str_id;

            $browser->loginAs(self::$user)
                    ->visit(self::$user_url)
                    ->press('ジャンルを編集する');
            
            $ini_genre = $browser->attribute('.genres', 'value');
            $new_genre = 'TEST-GENRE';

            $browser->type('.genres', 'TEST-GENRE')
                    ->press('ジャンルを編集する')
                    ->assertPathIs(self::$user_url)
                    ->assertSee($new_genre);
                    
            $browser->press('ジャンルを編集する');
            $browser->type('.genres', $ini_genre)
                    ->press('ジャンルを編集する');              // 元に戻しておく
        });
    }

    public function testDeleteFromBookshelf()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit(self::$user_url)
                    ->press('本を削除する');

            $book = self::$user->books->where('isInBookshelf', true)->first();
            $selector = '#' . $browser->attribute('.books', 'id');
            
            $browser->click($selector)
                    ->assertPresent($selector)
                    ->press('選択した本を削除する')
                    ->assertPathIs(self::$user_url)
                    ->assertMissing($selector);

            // 削除した本を登録し直している
            // 投稿と関連づいているからレコードは残っている
            // TODO: あとで投稿と関連づいていない本を消した場合も必要になる。
            $book->isInBookshelf = true;
            $book->save();

        });
    }
}
