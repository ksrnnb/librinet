<?php

namespace Tests\Feature\Follower;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\User;
use App\Notification;

class FollowTest extends TestCase
{
    protected $path;
    protected $params;
    protected $password;

    protected function setUp(): void
    {
        parent::setUp();
        $target_user = factory(User::class)->create();
        $login_user = factory(User::class)->create();

        $this->path = '/api/follow/';

        $this->params = [
            'targetId' => $target_user->id,
            'viewerId' => $login_user->id,
            'isFollowing' => false,
        ];
        
        $this->credential = [
            'strId' => $login_user->str_id,
            'password' => config('app.guest_password')
        ];
    }

    public function testCannotFollowWithoutAuthenticate()
    {
        $this->json("POST", $this->path, $this->params)
             ->assertStatus(401);
    }

    public function testCanFollow()
    {
        $this->authenticate();

        $this->json("POST", $this->path, $this->params)
             ->assertStatus(200);
    }

    public function testCannotRepeatFollow()
    {
        $this->authenticate();

        $this->json("POST", $this->path, $this->params)
             ->assertStatus(200);

        $this->json("POST", $this->path, $this->params)
             ->assertStatus(422);
    }

    public function testFollowAndUnFollowAndNotification()
    {
        $this->authenticate();

        $this->json("POST", $this->path, $this->params)
             ->assertStatus(200);
             
        // follow後の通知を取得
        $notification = Notification::all()->last();

        $this->params['isFollowing'] = true;

        $this->json("POST", $this->path, $this->params)
             ->assertStatus(200);

        // unfollowで通知が削除されたのを確認
        $this->assertEquals(Notification::find($notification->id), null);
    }
}
