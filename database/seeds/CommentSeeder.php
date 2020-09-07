<?php

use Illuminate\Database\Seeder;

class CommentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //  2人からコメント、1人は本も推める。
        $post = App\Post::find(1);
        $post->comments()->create([
            'message' => '私も読みました！',
            'user_id' => 3,
        ]);
        $post->comments()->create([
            'message' => 'この本もおすすめです！',
            'user_id' => 4,
        ]);
    }
}
