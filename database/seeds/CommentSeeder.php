<?php

use Illuminate\Database\Seeder;
use App\Book;

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
            'user_id' => 2,
        ]);
        $post->comments()->create([
            'message' => 'いいね！',
            'user_id' => 3,
        ]);

        //  TODO: Eager最適化したら、あとで消す
        $post->comments()->create([
            'message' => '私も読みました！',
            'user_id' => 5,
        ]);
        $post->comments()->create([
            'message' => '私も読みました！',
            'user_id' => 5,
        ]);
        $post->comments()->create([
            'message' => '私も読みました！',
            'user_id' => 5,
        ]);
        $post->comments()->create([
            'message' => '私も読みました！',
            'user_id' => 5,
        ]);
        $post->comments()->create([
            'message' => '私も読みました！',
            'user_id' => 5,
        ]);
        
        // TODO: ここ長すぎんか？
        $book = Book::fetchBook('9784798052588');

        $phpBook = Book::create([
            'isbn' => $book->isbn,          //  Laravel入門
            'title' => $book->title,
            'author' => $book->author,
            'cover' => $book->cover,
            'user_id' => 4,                 //  とりあえず4
            'genre_id' => 1,                //  1: IT (GenreSeederで作成する)
            'isRead' => 0,                  //  
            'isWanted' => 0,                //  
            'isRecommended' => 0,           //  
        ]);

        $post->comments()->create([
            'message' => 'この本はどうでしょうか？',
            'user_id' => 4,                 //  phpBookのIDと合わせる
            'book_id' => $phpBook->id,
        ]);
    }
}
