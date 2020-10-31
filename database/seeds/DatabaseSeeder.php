<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            GenreSeeder::class,     //  Genre
            UserSeeder::class,      //  User
            BookSeeder::class,      //  Book, Post
            FollowerSeeder::class,  //  Follower
            CommentSeeder::class,   //  Comment
            LikeSeeder::class,      //  Like
        ]);
    }
}
