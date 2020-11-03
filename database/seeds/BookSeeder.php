<?php

use Illuminate\Database\Seeder;
use App\User;
use App\Book;

class BookSeeder extends Seeder
{
    /**
     * [user_id => [genre_id => [ [isbn, message], [isbn, message], ...]]]
     */
    public $params = [
        // しょーご
        1 => [
            // SF
            1 => [
                // 電気羊
                [
                    '9784150102296',
                    '世界観が独特で面白く、一気に読んでしまいました！',
                ],
                // 1984
                [
                    '9784151200533',
                    '日記を書くことが許されないほどの監視社会で、
                    非常に恐ろしくも面白い内容でした。',
                ],
                // ニューロマンサー
                [
                    '9784150106720',
                    '言葉が独特で少し難しいですが、ワイルドな世界観がとても良かったです。'
                ],
                // 華氏451度
                [
                    '9784150119553',
                    '本を所持することが禁止された世界で、テレビによって思考力が低下した民衆が描かれており、現代にも通じるものがあるのではないかと感じました。'
                ],
                // 動物農場
                [
                    '9784151200878',
                    '共産主義への批判が寓話的に描かれています。この本が1945年に出版されていたことが驚きです。オーウェルが描く世界観は支配的ですね。'
                ],
                // わたしを離さないで
                [
                    '9784151200519',
                    '著者がノーベル賞を獲得されたので気になって読んでみました。
                    本書を読んで真相を知った今、もう一度読みたいと思える作品です。'
                ],
            ],
            // 文学
            2 => [
                // 高慢と偏見（上）
                [
                    '9784480038630',
                    '「謙遜ほど欺瞞的なものはないね」というダーシー氏の言葉が印象に残っています。19世紀の作品ですが、今でも存分に楽しめました。'
                ],
                // こころ
                [
                    '9784101010137',
                    'オリラジのあっちゃんが解説していたので、読んでみましたが、読んで損はなかったです。
                    しばらくしたら再読したいです。'
                ],
                // 銀の匙
                [
                    '9784041013380',
                    '古き良き日本、という印象が強く残っています。
                    昔の生活を思い描くことができ、とても良かったです。'
                ],
                // 雪国
                [
                  '9784041008461',
                  'なぜか駒子に惹かれて、どんどん読んでしまう、そんな作品でした。
                  もっと川端康成の本を読んでみたいですね。'
                ],
            ],
        ],
        // しんじ
        2 => [
            // IT
            3 => [
                // 徳丸本
                [
                    '9784797393163',
                    '非常に評判が良い本で、非常に濃厚な内容でした。もう一度復習したいです。',
                ],
                // ネットワーク
                [
                    '9784822283117',
                    '内容が少し古い本ですが、ネットワークの基礎を学ぶことができました。',
                ],
                // データベース
                [
                    '9784798118819',
                    'SQLの基礎を学ぶには良い本でした。',
                ],
                // リーダブルコード
                [
                    '9784873115658',
                    'これは誰もが読むべき本だなと思いました。何度でも再読する価値ありです。',
                ],
                // Laravel
                [
                    '9784798060996',
                    'Laravelはこの本で勉強しました。初心者でもわかりやすくて良かったです。',
                ]
            ],
        ],
        // えり
        3 => [
            // 健康と料理
            4 => [
                // 発酵の科学
                [
                    '9784065020449',
                    '発酵に関して科学的に知りたい、という人にお勧めです。腸内細菌最強説！',
                ],
                // 天然発酵の世界
                [
                    '9784806714903',
                    'かの有名なサンダー・キャッツの本です。
                    いろいろな発酵食品のレシピが載っておりお勧めです。
                    個人的にはテンペを作りたいです！',
                ],
                // 栄養学
                [
                    '9784791622887',
                    '栄養に関して調べ始めたときに利用しました。絵も多く非常に良いと思います。',
                ],
                // スポーツ栄養学
                [
                    '9784130527064',
                    'かなり科学寄りの本でした。。。。もう少し勉強してから読み直したいです。',
                ],
                // スパイスカレー
                [
                    '9784756242372',
                    'この本を読んでスパイスカレーをつくりはじめました。
                    初心者でも始められるのでお勧めです。',
                ],
            ],
            // 漫画
            5 => [
                // 3月のライオン
                [
                    '9784592145110',
                    'こんなに暖かい家族があるのか、と思える作品です。はやく続きを読みたいです！',
                ],
                // ハチクロ
                [
                    '9784088650791',
                    'たまに、こんな大学生活を送りたかったと思ってしまいます。
                    羽海野さんの作品は非常に良いですね。'
                ],
                // 君嘘
                [
                    '9784063713015',
                    '泣ける作品でありながらも、やる気を奮起させられる、とても良い作品です！'
                ]
            ],
        ],
        // ゆい
        4 => [
            // 自己啓発
            6 => [
                // マインドセット
                [
                    '9784794221780',
                    '成長マインドセットで常に努力していきたい。。。'
                ],
                // 寄付
                [
                    '9784532357986',
                    '寄付はお金持ちの人がするもの、という思い込みがありましたが、この本で変わりました。
                    少しずつでも寄付していきたいと思います。'
                ]
            ],
            // 英語
            7 => [
                // Duo
                [
                    '9784900790056',
                    '学生の頃、単語を覚えるのに重宝しました。
                    未だに幾つかの例文は暗唱できることに自分でも驚きます。'
                ],
                // 瞬間英作文
                [
                    '9784860641344',
                    '最近お世話になっている本です。
                    基礎的な文法を使いこなせば、けっこう会話がスムーズにできるなと実感しています。'
                ]
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
        foreach ($this->params as $user_id => $genres) {
            $user = User::find($user_id);

            foreach ($genres as $genre_id => $books) {
                foreach ($books as $book) {
                    [$isbn, $message] = $book;
                    $book_array = Book::getBookParams($isbn, $genre_id, true);
                    $book = $user->books()->create($book_array);
                    $book->registerPost($message);
                }
            }
        }
    }
}