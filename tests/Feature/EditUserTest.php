<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\User;

class EditUserTest extends TestCase
{
    use RefreshDatabase;

    protected $edit_path;
    protected $user;
    protected $hasSetUp = false;

    /*
    *   毎回Userの情報を配列にセットしてpostするので、メソッドにまとめた
    *   @return $response
    */
    protected function postUser()
    {
        $user = ['user' => $this->user->toArray()];
        $response = $this->post($this->edit_path, $user);

        return $response;
    }

    protected function setUp(): void
    {
        parent::setUp();

        if (! $this->hasSetUp) {
            $this->hasSetUp = true;
            $this->edit_path = '/api/user/edit';
            $this->user = factory(User::class)->create();
    
            $credential = [
                'strId' => $this->user->str_id,
                'password' => config('app.guest_password')
            ];
    
            // sanctum
            $this->get('/sanctum/csrf-cookie')
                 ->assertStatus(204);
            
            // login
            $this->post('/api/login', $credential)
                 ->assertStatus(200);
        }
    }

    public function testEditUser()
    {
        $this->user->name = 'test_name';

        $this->postUser()
             ->assertStatus(200)
             ->assertSee('updated');
    }

    // public function testTooLongNameAndStrId()
    // {
    //     $this->user->name = 'test_too_long_name_aaaaaaaaaaaaaaaaaaaa';

    //     $this->postUser();

    //     $this->user->name = 'test_name';
    //     $this->user->str_id = 'test_too_long_str_id_aaaaaaaaaaaaaaaaaaaa';

    //     $this->postUser();

    //     $this->user->str_id = 'test_str_id';
    // }

    // public function testEmptyNameAndStrId()
    // {
    //     $this->user->name = '';
    //     $this->postUser();

    //     $this->user->name = 'test_name';
    //     $this->user->str_id = '';

    //     $this->postUser();
    // }
}
