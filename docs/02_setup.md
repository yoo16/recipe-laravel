# 環境構築・起動

前提: `01_php_version.md` のチェックリストを満たしていること。

## セットアップ

```bash
cd recipe-laravel
composer install
npm install --legacy-peer-deps    # vite のピア依存の警告を回避
cp .env.example .env              # 未作成の場合
php artisan key:generate
touch database/database.sqlite    # 未作成の場合
php artisan migrate
```

## 起動

```bash
composer dev
```

- Laravel サーバーと Vite を同時に起動する。ブラウザで http://localhost:8000 を開く。
- 初回は `/register` でユーザー登録する。

`php artisan serve` は Laravel サーバーだけを起動する。Vite が動かないため React の変更が反映されない
（`npm run build` 済みのビルドを表示するだけなら動く）。開発中は `composer dev` を使う。

## テスト・ビルド

```bash
php artisan test
npm run build
```

## 主な環境変数（.env）

| 変数 | 既定値 | 説明 |
|------|--------|------|
| `DB_CONNECTION` | `sqlite` | DB は SQLite（`database/database.sqlite`） |
| `GEMINI_MOCK` | `true` | `true` の間は Gemini API を呼ばずダミーを返す |
| `GEMINI_API_KEY` | 空 | 実 API を使うときのみ設定 |
| `GEMINI_MODEL` | `gemini-2.5-flash` | 実 API 利用時のモデル名（利用可否は要確認） |
