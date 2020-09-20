<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;
use App\User;
use App\Book;

class UserPageTest extends DuskTestCase
{

    public function testShowBooks()
    {
        $this->browse(function (Browser $browser) {
            $id = 1;
            $users = User::with(['books' => function ($query) use ($id) {
                $query->where('user_id', $id);
            }])->get();

            $user = $users->where('id', $id)->first();

            $browser->visit('/user/show/' . $user->str_id)
                    ->assertSee($user->str_id);

            // 本がない場合は処理しない
            foreach ($user->books as $book) {
                $browser->assertSee($book->title);
            }
        });
    }
}
