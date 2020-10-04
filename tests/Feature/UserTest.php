<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\User;
use Laravel\Sanctum\Sanctum;

class UserTest extends TestCase
{

    public function testUserSearch()
    {
        $user = User::find(1);
        $response = $this->post('/api/user', [
            'user' => $user->str_id,
        ]);

        $response->assertSee($user->name);
    }
}
