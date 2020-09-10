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
        //  2人からコメント        
        $post = App\Post::find(1);
        $messages = [
            2 => '私も読みました！',
            3 => 'いいね！',
        ];
        foreach ($messages as $id => $message) {
            $post->createComment($user_id = $id, $message = $message);
        }

        //  違う投稿に3人からコメント
        $post = App\Post::find(8);
        $messages = [
            ['id' => 1, 'message' => '私も読みました！'],
            ['id' => 3, 'message' => 'いいね！'],
            ['id' => 5, 'message' => '最高！'],
        ];

        foreach ($messages as $item) {
            $post->createComment($user_id = $item['id'], $message = $item['message']);
        }
        
        // 本をおすすめするコメント
        $book = Book::fetchBook('9784798052588');

        $phpBook = Book::create([
            'isbn' => $book->isbn,          //  Laravel入門
            'title' => $book->title,
            'author' => $book->author,
            'cover' => $book->cover,
            'user_id' => 4,                 //  とりあえず4
            'genre_id' => 1,                //  1: IT (GenreSeederで作成する)
            'isInBookshelf' => 0,
        ]);

        $id = 4;
        $message = 'この本はどうでしょうか？';
        $post->createComment($user_id = $id, $message = $message, $book_id = $phpBook->id);
    }
}
