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

    protected $path = '/api/genre/edit';
    protected $book;
    protected $genre;
    protected $has_setup = false;

    protected function setUp(): void
    {
        parent::setUp();

        if (! $this->has_setup) {
            $this->has_setup = true;
            $this->user = factory(User::class)->create();
    
            $this->credential = [
                'strId' => $this->user->str_id,
                'password' => config('app.guest_password')
            ];

            $this->book = $this->user
                               ->books()
                               ->save(factory(Book::class)->make());
                               
            Genre::create(['name' => 'initial_genre']);

            $genre_id = $this->book->genre_id;
            $this->genre = [
                $genre_id => 'New_Genre_Name',
            ];
        }
    }

    public function testCannotEditWhenIsNotAuthenticated()
    {
        $params = [
            // 'userId' => $this->user->id,
            'newGenres' => $this->genre,
        ];

        $this->json('POST', $this->path, $params)
             ->assertStatus(401);
    }

    public function testEditGenre()
    {
        $this->authenticate();
        $params = [
            'newGenres' => $this->genre,
        ];

        $this->json('POST', $this->path, $params)
             ->assertStatus(200)
             ->assertSee('updated');
    }

    public function testNoGenreCannotUpdate()
    {
        $this->authenticate();

        // empty string
        $params = [
            'newGenres' => '',
        ];

        $this->json('POST', $this->path, $params)
             ->assertStatus(400);

        // emtpy array
        $params = [
            'newGenres' => [],
        ];

        $this->json('POST', $this->path, $params)
             ->assertStatus(400);

        // emtpy array
        $params = [
            'newGenres' => [1 => ''],
        ];

        $this->json('POST', $this->path, $params)
             ->assertStatus(400);
    }
}
