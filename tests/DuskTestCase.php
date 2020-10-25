<?php

namespace Tests;

use Facebook\WebDriver\Chrome\ChromeOptions;
use Facebook\WebDriver\Remote\DesiredCapabilities;
use Facebook\WebDriver\Remote\RemoteWebDriver;
use Laravel\Dusk\TestCase as BaseTestCase;

abstract class DuskTestCase extends BaseTestCase
{
    use CreatesApplication;

    // 各テストで共通の処理。一回ログインすれば、
    // そのテストファイルの中ではログインが継続される。
    public function login($browser)
    {
        $str_id = $this->credential['str_id'];
        $password = $this->credential['password'];

        $browser->visit('/login')
                ->waitFor('#user-id')
                ->type('user-id', $str_id)
                ->type('password', $password)
                ->press('#normal-login')
                ->waitForLocation('/home')
                ->waitFor('#subtitle');

        return $browser;
    }

    /**
     * Prepare for Dusk test execution.
     *
     * @beforeClass
     * @return void
     */
    public static function prepare()
    {
        // static::startChromeDriver();
    }

    /**
     * Create the RemoteWebDriver instance.
     *
     * @return \Facebook\WebDriver\Remote\RemoteWebDriver
     */
    protected function driver()
    {
        $options = (new ChromeOptions())->addArguments([
            '--disable-gpu',
            '--headless',
            '--window-size=1920,1080',
            '--no-sandbox',
        ]);

        if (env('APP_ENV')  == 'develop') {
            return RemoteWebDriver::create(
                'http://chrome:4444',
                DesiredCapabilities::chrome()->setCapability(
                    ChromeOptions::CAPABILITY,
                    $options
                )
            );
        } else {
            return RemoteWebDriver::create(
                'http://localhost:9515',
                DesiredCapabilities::chrome()->setCapability(
                    ChromeOptions::CAPABILITY,
                    $options
                )
            );
        }
    }
}
