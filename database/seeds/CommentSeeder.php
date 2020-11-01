<?php

use Illuminate\Database\Seeder;
use App\Book;
use App\Post;
use App\User;

class CommentSeeder extends Seeder
{

    /**
     * [ post_id => [ user_id => message ], ... ]
     */
    public $posts = [
        // こころ
        8 => [
            // 吾輩は猫である
            [
                'user_id' => 3,
                'message' => '定番ですが、『吾輩は猫である』もいいですよね。',
                'isbn'    => '9784101010014',
            ],

            // 坊っちゃん
            [
                'user_id' => 4,
                'message' => '愛媛県民として読んでおきたい一冊。',
                'isbn'    => '9784101010038',
            ],

        ],
        
        // SQLの基礎
        13 => [
            // 達人に学ぶDB設計
            [
                'user_id' => 4,
                'message' => '次はこの本がお勧めです！',
                'isbn'    => '9784798124704',
            ],
        ],

        // 天然発酵
        17 => [
            [
                'user_id' => 1,
                'message' => '他にも良い発酵食品ありますか？',
            ],
            
            [
                'user_id' => 3,
                'message' => 'ザワークラウトはキャベツを塩漬けするだけなので、作りやすくて良いですよ！',
            ],
        ],

        // カレー
        20 => [
            [
                'user_id' => 1,
                'message' => 'スパイスカレーいいですね、自分も挑戦してみたいです！',
            ],
        ],
    ];

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $posts = $this->posts;

        foreach ($posts as $post_id => $post) {
            foreach ($post as $params) {
                $user = User::find($params['user_id']);
                $has_isbn = isset($params['isbn']);
              
                if ($has_isbn) {
                    $book_array = Book::getBookParams($params['isbn']);
                    $book = $user->books()->create($book_array);
                }

                $book_id = $has_isbn ? $book->id : null;
                $target_post = Post::find($post_id);
                $target_post->createComment($user->id, $params['message'], $book_id);
            }
        }
    }
}
