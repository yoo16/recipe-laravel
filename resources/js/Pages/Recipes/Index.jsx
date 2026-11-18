import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ recipes }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">レシピ一覧</h2>
                    <Link href={route('recipes.create')} className="rounded bg-gray-800 px-4 py-2 text-sm text-white">新規作成</Link>
                </div>
            }
        >
            <Head title="レシピ一覧" />
            <div className="mx-auto max-w-3xl py-8 sm:px-6 lg:px-8">
                {recipes.length === 0 && <p className="text-gray-500">まだレシピがありません。</p>}
                <ul className="space-y-3">
                    {recipes.map((r) => (
                        <li key={r.id} className="rounded-lg bg-white p-4 shadow-sm">
                            <Link href={route('recipes.show', r.id)} className="font-semibold text-gray-800 hover:underline">{r.title}</Link>
                            <p className="text-sm text-gray-500">{[r.cook_minutes && `${r.cook_minutes}分`, r.servings && `${r.servings}人分`].filter(Boolean).join(' / ')}</p>
                            {r.description && <p className="mt-1 text-sm text-gray-600">{r.description}</p>}
                        </li>
                    ))}
                </ul>
            </div>
        </AuthenticatedLayout>
    );
}
