<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use RuntimeException;

class GeminiRecipeService
{
    /**
     * キーワードからレシピ案(JSON)を生成する。
     *
     * @return array{title:string,description:string,servings:int,cook_minutes:int,ingredients:array<int,array{name:string,amount:string}>,steps:array<int,string>}
     */
    public function suggest(string $keywords): array
    {
        $key = config('services.gemini.key');
        if (config('services.gemini.mock') || ! $key) {
            return $this->mock($keywords);
        }

        $model = config('services.gemini.model');
        $prompt = "次のキーワードに合う家庭向けレシピを日本語で1つ提案してください。\nキーワード: {$keywords}";

        $res = Http::timeout(60)
            ->withHeaders(['x-goog-api-key' => $key])
            ->post("https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent", [
                'contents' => [['parts' => [['text' => $prompt]]]],
                'generationConfig' => [
                    'responseMimeType' => 'application/json',
                    'responseSchema' => [
                        'type' => 'OBJECT',
                        'properties' => [
                            'title' => ['type' => 'STRING'],
                            'description' => ['type' => 'STRING'],
                            'servings' => ['type' => 'INTEGER'],
                            'cook_minutes' => ['type' => 'INTEGER'],
                            'ingredients' => [
                                'type' => 'ARRAY',
                                'items' => [
                                    'type' => 'OBJECT',
                                    'properties' => [
                                        'name' => ['type' => 'STRING'],
                                        'amount' => ['type' => 'STRING'],
                                    ],
                                    'required' => ['name', 'amount'],
                                ],
                            ],
                            'steps' => ['type' => 'ARRAY', 'items' => ['type' => 'STRING']],
                        ],
                        'required' => ['title', 'description', 'servings', 'cook_minutes', 'ingredients', 'steps'],
                    ],
                ],
            ])->throw();

        $text = $res->json('candidates.0.content.parts.0.text');
        $data = is_string($text) ? json_decode($text, true) : null;

        if (! is_array($data) || empty($data['title'])) {
            throw new RuntimeException('Gemini の応答を解釈できませんでした。');
        }

        return $data;
    }

    /** API を呼ばないモック応答。 */
    private function mock(string $keywords): array
    {
        return [
            'title' => "{$keywords}のかんたんレシピ（モック）",
            'description' => "「{$keywords}」から生成したダミーのレシピです。",
            'servings' => 2,
            'cook_minutes' => 20,
            'ingredients' => [
                ['name' => $keywords, 'amount' => '200g'],
                ['name' => '醤油', 'amount' => '大さじ1'],
                ['name' => '砂糖', 'amount' => '小さじ1'],
            ],
            'steps' => [
                "{$keywords}を食べやすい大きさに切る。",
                'フライパンで火が通るまで焼く。',
                '調味料を加えて全体にからめる。',
            ],
        ];
    }
}
