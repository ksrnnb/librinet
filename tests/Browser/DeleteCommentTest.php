<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;
use App\User;
use App\Book;

class DeleteCommentTest extends DuskTestCase
{
    use DatabaseMigrations;

    protected $user;
    protected $credential;
    protected $message;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = Factory(User::class)->create();

        $this->credential = [
            'str_id' => $this->user->str_id,
            'password' => config('app.guest_password')
        ];

        $this->post = $this->user->books()
                                 ->save(factory(Book::class)->make())
                                 ->registerPost('test_post_message');

        $this->message = 'test_comment_message';

        $this->post->createComment($user_id = $this->user->id, $message = $this->message);
    }

    public function testCommentDelete()
    {
            $this->browse(function (Browser $browser) {

                    $browser = $this->login($browser);

                    // 削除前にコメントがみえることを確認
                    $browser->visit('/home')
                            ->waitFor('.feed')
                            ->assertSee($this->message);
        
                    $comment_delete_button_selector = '.feed-wrapper:last-child #trash-icon';
                    
                    // 削除後はコメントがみえないことを確認
                    $browser->press($comment_delete_button_selector)
                            ->waitUntilMissingText($this->message)
                            ->assertDontSee($this->message);

                    // ページリロード後も投稿は残っていて、コメントがみえないことを確認
                    $browser->refresh()
                            ->waitFor('.feed')
                            ->assertDontSee($this->message);
            });
    }
}
