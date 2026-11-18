# アプリ構成

## 技術スタック

- Laravel 13 / PHP 8.3 以上
- Inertia + React（Breeze）/ Tailwind CSS / Vite
- 認証: Breeze（セッション認証）。Sanctum は導入済みで、トークン API 用に `HasApiTokens` を User に付与
- DB: SQLite

## 画面とルート

| 画面 | URL | ルート名 |
|------|-----|----------|
| レシピ一覧 | `/recipes` | `recipes.index` |
| レシピ作成（AI 下書き含む） | `/recipes/create` | `recipes.create` |
| レシピ詳細 | `/recipes/{id}` | `recipes.show` |
| レシピ編集 | `/recipes/{id}/edit` | `recipes.edit` |
| AI 下書き生成 | `POST /recipes/suggest` | `recipes.suggest` |

`/dashboard` は `/recipes` へリダイレクト。他ユーザーのレシピにアクセスすると 404。

## ファイル構成

```
app/Models/Recipe.php                    # ingredients / steps は JSON カラム（array キャスト）
app/Http/Controllers/RecipeController.php
app/Services/GeminiRecipeService.php     # Gemini 連携（モック切替あり）
database/migrations/*_create_recipes_table.php
resources/js/Pages/Recipes/              # Index / Create / Show / Edit
resources/js/Components/RecipeForm.jsx   # 作成・編集共通フォーム
tests/Feature/RecipeTest.php
```

## recipes テーブル

| カラム | 型 | 備考 |
|--------|----|------|
| user_id | FK | users.id（ユーザー削除で連動削除） |
| title | string | 必須 |
| description | text | 任意 |
| servings | unsigned small int | 任意 |
| cook_minutes | unsigned small int | 任意 |
| ingredients | json | `[{name, amount}]` |
| steps | json | `["手順1", ...]` |

## AI 連携の流れ

1. 作成画面でキーワードを入力して送信（`POST /recipes/suggest`）
2. `GeminiRecipeService::suggest()` が JSON を返す
   - `GEMINI_MOCK=true`（または API キー未設定）: API を呼ばず、キーワードからダミーの JSON を生成
   - `GEMINI_MOCK=false` かつキーあり: Gemini API を構造化出力（JSON スキーマ指定）で呼ぶ
3. 結果をセッション（`draft`）に載せて `/recipes/create` へリダイレクトし、フォームに下書きとして反映
4. ユーザーが確認・編集して保存（AI の出力は自動保存しない）

失敗時は `keywords` フィールドにエラーを返し、`RecipeController@suggest failed` をログ出力する。

## 今後の拡張アイデア

- 実際の Gemini API への切り替え（キー取得、モデル名の確認、料金・レート制限の説明）
- 材料の人数換算、買い物リスト
- 写真から食材を認識（マルチモーダル）
- Sanctum によるトークン API 化
