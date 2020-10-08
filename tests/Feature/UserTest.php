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
    protected $search_path;
    protected $has_setup = false;

    protected function search($input)
    {
        $user = [
            'user' => $input
        ];

        $response = $this->post($this->search_path, $user);

        return $response;
    }

    protected function setUp(): void
    {
        parent::setUp();

        if (! $this->has_setup) {
            $this->has_setup = true;
            $this->user = factory(User::class)->create();
            $this->search_path = '/api/user';
        }
    }

    public function testUserSearchByStrId()
    {
        $str_id = $this->user->str_id;
        $this->search($str_id)
             ->assertStatus(200)
             ->assertSee($this->user->name);
    }

    public function testUserSearchByName()
    {
        $name = $this->user->name;
        
        $this->search($name)
             ->assertStatus(200)
             ->assertSee($this->user->name);
    }

    public function testCannotSearchWhenInputIsNullOrNotMatch()
    {
        $input = null;
        
        $this->search($input)
             ->assertJsonCount(0);  // laravelで定義されているアサート
             
        $input = '';
        $this->search($input)
             ->assertJsonCount(0);
             
        $input = '';
        $this->search($input)
             ->assertJsonCount(0);
    }
}
