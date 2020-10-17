<?php

use Illuminate\Database\Seeder;
use App\Events\Liked;

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
        $like = $post->likes()->create([
            'user_id' => 4,
        ]);

        event(new Liked($like));
        
        //  Commentにいいね (コメントのユーザーはid2)
        $comment = App\Comment::find(1);
        $likes = $comment->likes()->createMany([
            ['user_id' => 1],
            ['user_id' => 3],
            ['user_id' => 4],
            ['user_id' => 5],
        ]);

        foreach ($likes as $like) {
            event(new Liked($like));
        }
    }
}
