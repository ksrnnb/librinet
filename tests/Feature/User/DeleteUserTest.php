<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\User;

class DeleteUserTest extends TestCase
{
    use RefreshDatabase;

    protected $delete_path;
    protected $user;
    protected $has_setup = false;

    protected function setUp(): void
    {
        parent::setUp();

        if (! $this->has_setup) {
            $this->has_setUp = true;
            $this->delete_path = '/api/user';
            $this->user = factory(User::class)->create();
    
            $this->credential = [
                'strId' => $this->user->str_id,
                'password' => config('app.guest_password')
            ];
        }
    }

    public function testCannotDeleteWhenIsNotAuthenticated()
    {
        $user = $this->user->toArray();
        
        $response = $this->delete($this->delete_path, $user);

        $this->delete($this->delete_path, $user)
             ->assertStatus(302);
    }

    public function testCannotDeleteWhenIdIsDifferent()
    {
        $this->authenticate();
        $this->user->id = $this->user->id + 1;
        $user = $this->user->toArray();
        
        $this->delete($this->delete_path, $user)
             ->assertStatus(400);
    }

    public function testCanDeleteUser()
    {
        $this->authenticate();
        $user = $this->user->toArray();

        $this->delete($this->delete_path, $user)
             ->assertStatus(200)
             ->assertSee('deleted');
    }
}
