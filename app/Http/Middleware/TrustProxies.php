<?php

namespace App\Http\Middleware;

use Fideloper\Proxy\TrustProxies as Middleware;
use Illuminate\Http\Request;

class TrustProxies extends Middleware
{
    /**
     * The trusted proxies for this application.
     *
     * @var array|string|null
     */

     // ALB経由の場合はipアドレスが動的に変わるのでワイルドカードを指定
     // https://readouble.com/laravel/7.x/ja/requests.html#configuring-trusted-proxies
    protected $proxies = '**';

    /**
     * The headers that should be used to detect proxies.
     *
     * @var int
     */
    protected $headers;

    public function __construct()
    {
        if (config('app.env') === 'production') {
            $this->headers = Request::HEADER_X_FORWARDED_AWS_ELB;
        } else {
            $this->headers = Request::HEADER_X_FORWARDED_ALL;
        }
    }
}
