<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class HelpersTest extends TestCase
{
    /**
     * A basic unit test example.
     *
     * @return void
     */
    protected $params;

    protected function setUp(): void
    {
        $this->params = [
            'id' => 1,
            'str_id' => 'test_id',
            'name' => 'test_user',
            'email' => 'test@test.com',
            'image' => null,
            'books' => ['book1', 'book2'],
        ];
    }
    
    public function testExtractUserParams()
    {

        $params = extract_user_params($this->params);

        $this->assertArrayHasKey('name', $params);
        $this->assertArrayNotHasKey('books', $params);
    }
}
