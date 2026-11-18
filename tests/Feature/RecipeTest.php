<?php

namespace Tests\Feature;

use App\Models\Recipe;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class RecipeTest extends TestCase
{
    use RefreshDatabase;

    public function test_recipe_is_created_and_visible_to_owner_only(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user)->post('/recipes', [
            'title' => '親子丼',
            'ingredients' => [['name' => '卵', 'amount' => '2個']],
            'steps' => ['煮る'],
        ])->assertRedirect();

        $recipe = Recipe::first();
        $this->assertSame('卵', $recipe->ingredients[0]['name']);
        $this->actingAs($user)->get("/recipes/{$recipe->id}")->assertOk();
        $this->actingAs(User::factory()->create())->get("/recipes/{$recipe->id}")->assertNotFound();
    }

    public function test_suggest_redirects_to_create_with_ai_draft(): void
    {
        config(['services.gemini.key' => 'test', 'services.gemini.mock' => false]);
        $draft = ['title' => 'AI丼', 'description' => 'd', 'servings' => 2, 'cook_minutes' => 10,
            'ingredients' => [['name' => '米', 'amount' => '1合']], 'steps' => ['炊く']];
        Http::fake(['generativelanguage.googleapis.com/*' => Http::response([
            'candidates' => [['content' => ['parts' => [['text' => json_encode($draft)]]]]],
        ])]);

        $this->actingAs(User::factory()->create())
            ->post('/recipes/suggest', ['keywords' => '時短'])
            ->assertRedirect('/recipes/create')
            ->assertSessionHas('draft.title', 'AI丼');
    }

    public function test_suggest_failure_returns_error(): void
    {
        config(['services.gemini.key' => 'test', 'services.gemini.mock' => false]);
        Http::fake(['*' => Http::response([], 500)]);

        $this->actingAs(User::factory()->create())
            ->post('/recipes/suggest', ['keywords' => 'x'])
            ->assertSessionHasErrors('keywords');
    }

    public function test_suggest_uses_mock_without_http(): void
    {
        config(['services.gemini.mock' => true]);
        Http::fake();

        $this->actingAs(User::factory()->create())
            ->post('/recipes/suggest', ['keywords' => '鶏むね肉'])
            ->assertRedirect('/recipes/create')
            ->assertSessionHas('draft.title');
        Http::assertNothingSent();
    }
}
