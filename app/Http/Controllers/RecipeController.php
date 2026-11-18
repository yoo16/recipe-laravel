<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use App\Services\GeminiRecipeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Throwable;

class RecipeController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Recipes/Index', [
            'recipes' => $request->user()->recipes()->latest()->get(['id', 'title', 'description', 'cook_minutes', 'servings']),
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render('Recipes/Create', [
            'draft' => $request->session()->get('draft'),
        ]);
    }

    public function store(Request $request)
    {
        $recipe = $request->user()->recipes()->create($this->validated($request));

        return redirect()->route('recipes.show', $recipe);
    }

    public function show(Request $request, Recipe $recipe)
    {
        $this->authorizeOwner($request, $recipe);

        return Inertia::render('Recipes/Show', ['recipe' => $recipe]);
    }

    public function edit(Request $request, Recipe $recipe)
    {
        $this->authorizeOwner($request, $recipe);

        return Inertia::render('Recipes/Edit', ['recipe' => $recipe]);
    }

    public function update(Request $request, Recipe $recipe)
    {
        $this->authorizeOwner($request, $recipe);
        $recipe->update($this->validated($request));

        return redirect()->route('recipes.show', $recipe);
    }

    public function destroy(Request $request, Recipe $recipe)
    {
        $this->authorizeOwner($request, $recipe);
        $recipe->delete();

        return redirect()->route('recipes.index');
    }

    /** キーワードから Gemini でレシピ案を生成し、新規作成フォームへ遷移する。 */
    public function suggest(Request $request, GeminiRecipeService $gemini)
    {
        $data = $request->validate(['keywords' => ['required', 'string', 'max:200']]);

        try {
            $draft = $gemini->suggest($data['keywords']);
        } catch (Throwable $e) {
            Log::error('RecipeController@suggest failed', ['error' => $e->getMessage()]);

            return back()->withErrors(['keywords' => 'AI 生成に失敗しました。時間をおいて再度お試しください。']);
        }

        return redirect()->route('recipes.create')->with('draft', $draft);
    }

    private function authorizeOwner(Request $request, Recipe $recipe): void
    {
        abort_unless($recipe->user_id === $request->user()->id, 404);
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'servings' => ['nullable', 'integer', 'min:1', 'max:100'],
            'cook_minutes' => ['nullable', 'integer', 'min:0', 'max:1440'],
            'ingredients' => ['required', 'array', 'min:1'],
            'ingredients.*.name' => ['required', 'string', 'max:100'],
            'ingredients.*.amount' => ['nullable', 'string', 'max:100'],
            'steps' => ['required', 'array', 'min:1'],
            'steps.*' => ['required', 'string', 'max:1000'],
        ]);
    }
}
