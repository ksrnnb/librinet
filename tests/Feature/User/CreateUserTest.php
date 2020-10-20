<?php

namespace Tests\Feature\User;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\User;

class CreateUserTest extends TestCase
{
    use RefreshDatabase;

    protected $path;
    protected $form;
    protected $has_setup = false;

    protected function setUp(): void
    {
        parent::setUp();

        if (! $this->has_setup) {
            $this->has_setup = true;
            $this->path = '/api/signup';
    
            // this form can create user
            $this->form = [
                'name' => 'test_user',
                'str_id' => 'test_user_id',
                'email' => 'test@test.com',
                'password' => 'test_password',
                'password_confirmation' => 'test_password',
            ];
        }
    }

    public function testCreateUser()
    {
        // success
        $response = $this->post($this->path, $this->form)
                         ->assertStatus(200);

        $response->assertJsonStructure([
            'user' => [
                'genres',
                'books',
                'ordered_books',
                'notifications',
                'posts',
                'comments',
                'likes',
                'followings',
                'followers',
                ],
            'following_posts',
            'examples',
        ]);
    }

    public function testCannotCreateNameValidation()
    {
        // empty name validation
        $this->form['name'] = '';
        $this->post($this->path, $this->form)
             ->assertStatus(302);

        // too short name validation
        $this->form['name'] = 'too_long_name' . str_repeat('a', 32);
        $this->post($this->path, $this->form)
             ->assertStatus(302);

        // include space validation
        $this->form['name'] = 'include space name';
        $this->post($this->path, $this->form)
             ->assertStatus(302);

        // include space validation (全角)
        $this->form['name'] = 'include　space　name';
        $this->post($this->path, $this->form)
             ->assertStatus(302);
    }

    public function testCannotCreateStrIdValidation()
    {
        // empty str_id validation
        $this->form['str_id'] = '';
        $this->post($this->path, $this->form)
             ->assertStatus(302);

        // too short str_id validation
        $this->form['str_id'] = 'a';
        $this->post($this->path, $this->form)
             ->assertStatus(302);

        // too long str_id validation
        $this->form['str_id'] = 'too_long_str_id' . str_repeat('a', 32);
        $this->post($this->path, $this->form)
             ->assertStatus(302);

        // include space
        $this->form['str_id'] = 'include space id';
        $this->post($this->path, $this->form)
             ->assertStatus(302);

        // include symbol
        $this->form['str_id'] = 'str_id_include_@';
        $this->post($this->path, $this->form)
             ->assertStatus(302);
    }

    public function testCannotCreateEmailValidation()
    {
        // empty email validation
        $this->form['email'] = '';
        $this->post($this->path, $this->form)
             ->assertStatus(302);

        // too long email validation
        $this->form['email'] = 'too_long_email' . str_repeat('a', 255) . '@test.com';
        $this->post($this->path, $this->form)
             ->assertStatus(302);

        // start from @ sign
        $this->form['email'] = '@_start_from_at_sign';
        $this->post($this->path, $this->form)
             ->assertStatus(302);

        // end with @ sign
        $this->form['email'] = 'start_from_at_sign_@';
        $this->post($this->path, $this->form)
             ->assertStatus(302);

        // 2 @ sign
        $this->form['email'] = 'include_2_@sign@test.com';
        $this->post($this->path, $this->form)
             ->assertStatus(302);
    }

    public function testCannotCreatePasswordValidation()
    {
        // empty password validation
        $this->form['password'] = '';
        $this->form['password_confirmation'] = '';
        $this->post($this->path, $this->form)
             ->assertStatus(302);

        // too short password validation
        $this->form['password'] = 'aa';
        $this->form['password_confirmation'] = 'aa';
        $this->post($this->path, $this->form)
             ->assertStatus(302);

        // too long password validation
        $this->form['password'] = 'too_long_password' . str_repeat('a', 255);
        $this->form['password_confirmation'] = 'too_long_password' . str_repeat('a', 255);
        $this->post($this->path, $this->form)
             ->assertStatus(302);

        // match password validation
        $this->form['password'] = 'different_password_1';
        $this->form['password_confirmation'] = 'diffrent_password_2';
        $this->post($this->path, $this->form)
             ->assertStatus(302);
    }

    public function testCannotCreateUniqueStrId()
    {
        // unique str_id validation
        $user = factory(User::class)->create();
        $this->form['str_id'] = $user->str_id;
        $this->post($this->path, $this->form)
             ->assertStatus(302);
    }

    public function testCannotCreateUniqueEmail()
    {
        // unique email validation
        $user = factory(User::class)->create();
        $this->form['email'] = $user->email;
        $this->post($this->path, $this->form)
             ->assertStatus(302);
    }
}
