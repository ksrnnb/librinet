<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    protected function authenticate()
    {
        // sanctum
        $this->get('/sanctum/csrf-cookie')
             ->assertStatus(204);
        
        // login
        $this->post('/api/login', $this->credential)
             ->assertStatus(200);
    }
}
