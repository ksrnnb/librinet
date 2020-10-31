<?php

use Illuminate\Database\Seeder;
use App\Events\Liked;
use App\Comment;
use App\Like;
use App\Post;

class LikeSeeder extends Seeder
{
    /**
     * [ post_id => [ user_id, user_id, ... ], ...]
     */
    public $posts = [
        8  => [2, 3, 4],
        10 => [3, 4],
        13 => [1],
        14 => [1],
        17 => [2],
        18 => [1, 2],
        20 => [1, 2],
    ];

    public $comments = [
        1 => [1, 2],
        3 => [3],
    ];
    
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // 投稿にいいね
        $posts = $this->posts;
        
        foreach ($posts as $post_id => $user_ids) {
            $post = Post::find($post_id);

            foreach ($user_ids as $user_id) {
                $like = $post->likes()->create(['user_id' => $user_id]);
                event(new Liked($like));
            }
        }

        // コメントにいいね
        $comments = $this->comments;
        
        foreach ($comments as $comment_id => $user_ids) {
            $comment = Comment::find($comment_id);

            foreach ($user_ids as $user_id) {
                $like = $comment->likes()->create(['user_id' => $user_id]);
                event(new Liked($like));
            }
        }
    }
}
