<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('str_id')->unique();
            $table->string('name');

            //  emailもUNIQUE制約かけたいけど複数カラムでUNIQUE制約にすると
            //  2つの組み合わせに対してUNIQUEかどうかになってしまうので、emailはuniqueにしてない。
            $table->string('email');

            //  emailをverifyした日が入るので必要。
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');

            //  VARCHAR(100)でNULL値可能なremember_tokenを追加する。
            //  ログイン情報を記憶するのに必要。
            $table->rememberToken();

            $table->string('avatar_img')->nullable();
            $table->string('bg_img')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
