import RecipeForm from '@/Components/RecipeForm';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Edit({ recipe }) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">レシピ編集</h2>}>
            <Head title="レシピ編集" />
            <div className="mx-auto max-w-3xl py-8 sm:px-6 lg:px-8">
                <div className="rounded-lg bg-white p-6 shadow-sm">
                    <RecipeForm initial={recipe} method="put" action={route('recipes.update', recipe.id)} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
