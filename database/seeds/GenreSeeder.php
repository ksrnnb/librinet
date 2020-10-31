<?php

use Illuminate\Database\Seeder;
use App\Genre;

class GenreSeeder extends Seeder
{
    public $genres = [
        ['name' => 'SF'],
        ['name' => '文学'],
        ['name' => 'IT'],
        ['name' => '健康と料理'],
        ['name' => '漫画'],
        ['name' => '自己啓発'],
        ['name' => '英語'],
    ];

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        foreach ($this->genres as $genre) {
            Genre::create($genre);
        }
    }
}
