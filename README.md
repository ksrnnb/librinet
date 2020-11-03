# リブリーネット -本をシェアするSNS-
[![ksrnnb](https://circleci.com/gh/ksrnnb/librinet.svg?style=svg)](https://app.circleci.com/pipelines/github/ksrnnb)

## 概要
他の人がどんな本を読んでいるのか知りたい、おすすめの本を共有したい、といった目的でサービスを作成しました。
本を検索して、投稿したり、自分の本棚に入れたりして共有することができます。

## URL
https://librinet.jp/

トップページの「ゲストユーザーでログイン」を押すと、ご利用いただけます。

## 機能一覧

### ユーザー機能

- ユーザー登録、編集、削除
- ユーザーの検索
- ユーザーページ
- プロフィール画像の投稿（トリミング機能つき→[Qiitaに投稿](https://qiita.com/ksrnnb/items/81d34faf4abc47ea4182)）

### 本に関する機能
- 外部APIの[openBD](https://openbd.jp/)を利用した検索機能（現在はISBNでのみ検索可能）
- 検索後、投稿 or 本棚に追加
- ユーザーページにて本棚の一覧表示
- 本棚から本の削除
- 本をジャンルでグループ化可能
- ジャンルの編集

### 投稿機能
- 本に関する投稿
- 投稿の削除
- 投稿に対するコメント
- 投稿に対するいいね機能（非同期）

### コメント機能
- 投稿に対してコメントが可能
- コメントに対するいいね機能（非同期）

### 通知機能
- 自身の投稿やコメントにいいね、フォローされた場合に通知
- 通知がある場合に、未読の件数を表示
<img src="https://i.imgur.com/soFP217.png" width="300"> <img src="https://i.imgur.com/a7kcbhf.png" width="300"> 

### フォロー機能
- ユーザーのフォロー、フォロー解除（非同期）
- ユーザーページからフォロー、フォロワーの一覧表示へのリンク

### SPA
- react-router-domを用いてアプリケーションをSPA化（一部ページは待ち時間が生じます）
- SPA認証にはLaravel Sanctumを利用。

## 使用技術
### フロントエンド
- React 16.13.1
- Bootstrap 4.0
- Sass

### バックエンド
- Laravel 7.26.1

### データベース
- MySQL 8.0

### サーバー
- Nginx
- PHP-FPM

### インフラ・開発環境など
- Terraform
- AWS (ECS on EC2, RDS, S3)
- CircleCI
- Docker (Docker Compose)

### 静的コード解析、コード整形
- Prettier
- ESLint
- phpcs

### その他
- react-router-dom
- PHPUnit
- Laravel Dusk
- Laravel Sanctum

## インフラ構成
AWSで下記の環境をTerraformで構築しています。（作成した環境のGitHubは[こちら](https://github.com/ksrnnb/terraform-environment)になります）
- CircleCIのテストに合格すると、ECR/ECSに自動でデプロイ
- 2台のEC2インスタンスをマルチAZとなるように配置
- RDSはマルチAZ配置なし
- 画像データの保存はS3を使用
- セッションの保持はスティッキーセッションを利用
![](https://i.imgur.com/sbazFld.jpg)
