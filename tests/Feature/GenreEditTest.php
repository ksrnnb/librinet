<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\User;
use App\Book;
use App\Genre;

class GenreEditTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $book;
    protected $genre;
    protected $credential;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = factory(User::class)->create();
        $this->book = $this->user
                           ->books()
                           ->save(factory(Book::class)->make());
        $genre = factory(Genre::class)->create();
        $this->genre = [
            $genre->id => 'New_Genre_Name',
        ];

        $this->credential = [
            'strId' => $this->user->str_id,
            'password' => config('app.guest_password')
        ];

        // sanctum
        $this->get('/sanctum/csrf-cookie')
             ->assertStatus(204);

        // login
        $this->post('/api/login', $this->credential)
             ->assertStatus(200);
    }

    public function testEditGenre()
    {
        // // sanctum
        // $this->get('/sanctum/csrf-cookie')
        //      ->assertStatus(204);

        // // login
        // $this->post('/api/login', $this->credential)
        //      ->assertStatus(200);

        $params = [
            'userId' => $this->user->id,
            'newGenres' => $this->genre,
        ];

        $response = $this->post('/api/genre/edit', $params);
        $response->assertStatus(200)
                 ->assertSeeText('updated');
    }

    public function testNoGenreCannotUpdate()
    {
        // empty string
        $params = [
            'userId' => $this->user->id,
            'newGenres' => '',
        ];

        $this->post('/api/genre/edit', $params)
             ->assertStatus(400);

        // emtpy array
        $params = [
            'userId' => $this->user->id,
            'newGenres' => [],
        ];

        $this->post('/api/genre/edit', $params)
             ->assertStatus(400);

        // emtpy array
        $params = [
            'userId' => $this->user->id,
            'newGenres' => [1 => ''],
        ];

        $this->post('/api/genre/edit', $params)
             ->assertStatus(400);
    }

    public function testDifferentUserCannotUpdate()
    {
        // different user
        $params = [
            'userId' => $this->user->id + 1,
            'newGenres' => $this->genre,
        ];

        $this->post('/api/genre/edit', $params)
             ->assertStatus(400);
    }
}
