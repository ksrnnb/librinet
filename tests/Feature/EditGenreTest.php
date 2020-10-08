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

    protected $book;
    protected $genre;
    protected $edit_path;
    protected $has_setup = false;

    protected function setUp(): void
    {
        parent::setUp();

        if (! $this->has_setup) {
            $this->has_setup = true;
            $this->edit_path = '/api/genre/edit';
            $this->user = factory(User::class)->create();
    
            $this->credential = [
                'strId' => $this->user->str_id,
                'password' => config('app.guest_password')
            ];

            $this->book = $this->user
                               ->books()
                               ->save(factory(Book::class)->make());
            $genre = factory(Genre::class)->create();
            $this->genre = [
                $genre->id => 'New_Genre_Name',
            ];
        }
    }

    public function testCannotEditWhenIsNotAuthenticated()
    {
        $params = [
            'userId' => $this->user->id,
            'newGenres' => $this->genre,
        ];

        $this->post($this->edit_path, $params)
             ->assertStatus(302);
    }

    public function testEditGenre()
    {
        $this->authenticate();
        $params = [
            'userId' => $this->user->id,
            'newGenres' => $this->genre,
        ];

        $this->post($this->edit_path, $params)
             ->assertStatus(200)
             ->assertSee('updated');
    }

    public function testNoGenreCannotUpdate()
    {
        $this->authenticate();

        // empty string
        $params = [
            'userId' => $this->user->id,
            'newGenres' => '',
        ];

        $this->post($this->edit_path, $params)
             ->assertStatus(400);

        // emtpy array
        $params = [
            'userId' => $this->user->id,
            'newGenres' => [],
        ];

        $this->post($this->edit_path, $params)
             ->assertStatus(400);

        // emtpy array
        $params = [
            'userId' => $this->user->id,
            'newGenres' => [1 => ''],
        ];

        $this->post($this->edit_path, $params)
             ->assertStatus(400);
    }

    public function testDifferentUserCannotUpdate()
    {
        $this->authenticate();

        // different user
        $params = [
            'userId' => $this->user->id + 1,
            'newGenres' => $this->genre,
        ];

        $this->post($this->edit_path, $params)
             ->assertStatus(400);
    }
}
