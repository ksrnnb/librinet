<?php

use Illuminate\Database\Seeder;

class LikeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //  Postにいいね
        $post = App\Post::find(2);
        $post->likes()->create([
            'user_id' => 4,
        ]);

        //  Commentにいいね2
        $comment = App\Comment::find(1);
        $comment->likes()->createMany([
            ['user_id' => 4],
            ['user_id' => 5],
        ]);
    }
}
