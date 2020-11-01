<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\User;

class DeleteUserTest extends TestCase
{
    use RefreshDatabase;

    protected $path = '/api/user';
    protected $user;
    protected $credential = false;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = factory(User::class)->create();

        $this->credential = [
            'strId' => $this->user->str_id,
            'password' => config('app.guest_password')
        ];
    }

    public function testCannotDeleteWhenIsNotAuthenticated()
    {
        $user = $this->user->toArray();
        
        $response = $this->delete($this->path, $user);

        $this->delete($this->path, $user)
             ->assertStatus(302);
    }

    public function testCannotDeleteWhenIdIsDifferent()
    {
        $this->authenticate();
        $this->user->id = $this->user->id + 1;
        $user = $this->user->toArray();
        
        $this->delete($this->path, $user)
             ->assertStatus(403);
    }

    public function testCanDeleteUser()
    {
        $this->authenticate();
        $user = $this->user->toArray();

        $this->delete($this->path, $user)
             ->assertStatus(200)
             ->assertSee('deleted');
    }
}
