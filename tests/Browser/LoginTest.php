<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;
use App\User;

class LoginTest extends DuskTestCase
{
    use DatabaseMigrations;

    protected $user;
    protected $has_created;
    protected $credential;

    protected function setUp(): void
    {
        parent::setUp();
        if (!$this->has_created) {
            $this->has_created = true;
            
            $this->user = Factory(User::class)->create();

            $this->credential = [
                'str_id' => $this->user->str_id,
                'password' => config('app.guest_password')
            ];
        }
    }

    public function testLogin()
    {
        // // sanctum
        // $this->get('/sanctum/csrf-cookie')
        //      ->assertStatus(204);
        
        // // login
        // $this->post('/api/login', $this->credential)
        //      ->assertStatus(200);

        $this->browse(function (Browser $browser) {
            // sanctum

            // $uses = array_flip(class_uses_recursive(static::class));
            // dd($uses);

            $str_id = $this->user->str_id;
            $password = config('app.guest_password');

            $browser->visit('/login')
                    ->waitFor('#user-id')
                    ->type('user-id', $str_id)
                    ->type('password', $password)
                    ->press('Login');

                    // assertAuthenticated()はエラーになる
        });
    }
}
