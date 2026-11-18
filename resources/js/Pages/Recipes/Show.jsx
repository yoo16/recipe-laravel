import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Show({ recipe }) {
    const destroy = () => {
        if (confirm('削除しますか？')) router.delete(route('recipes.destroy', recipe.id));
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">{recipe.title}</h2>}>
            <Head title={recipe.title} />
            <div className="mx-auto max-w-3xl space-y-6 py-8 sm:px-6 lg:px-8">
                <div className="rounded-lg bg-white p-6 shadow-sm">
                    <p className="text-sm text-gray-500">{[recipe.cook_minutes && `${recipe.cook_minutes}分`, recipe.servings && `${recipe.servings}人分`].filter(Boolean).join(' / ')}</p>
                    {recipe.description && <p className="mt-2 text-gray-700">{recipe.description}</p>}

                    <h3 className="mt-6 font-semibold">材料</h3>
                    <ul className="mt-2 divide-y">
                        {recipe.ingredients.map((i, k) => (
                            <li key={k} className="flex justify-between py-1"><span>{i.name}</span><span className="text-gray-500">{i.amount}</span></li>
                        ))}
                    </ul>

                    <h3 className="mt-6 font-semibold">手順</h3>
                    <ol className="mt-2 list-decimal space-y-2 pl-5">
                        {recipe.steps.map((s, k) => <li key={k}>{s}</li>)}
                    </ol>
                </div>
                <div className="flex gap-3">
                    <Link href={route('recipes.edit', recipe.id)} className="rounded bg-gray-800 px-4 py-2 text-sm text-white">編集</Link>
                    <button onClick={destroy} className="rounded bg-red-600 px-4 py-2 text-sm text-white">削除</button>
                    <Link href={route('recipes.index')} className="px-4 py-2 text-sm text-gray-600">一覧へ</Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
