<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\User;
use Laravel\Sanctum\Sanctum;

class UserTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = factory(User::class)->create();
    }

    public function testUserSearchById()
    {
        $response = $this->post('/api/user', [
            'user' => $this->user->str_id,
        ]);

        $response->assertSee($this->user->name);
    }

    public function testUserSearchByName()
    {
        $response = $this->post('/api/user', [
            'user' => $this->user->name,
        ]);

        $response->assertSee($this->user->id);
    }
}
