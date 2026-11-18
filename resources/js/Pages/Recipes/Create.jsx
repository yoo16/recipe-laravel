import PrimaryButton from '@/Components/PrimaryButton';
import RecipeForm from '@/Components/RecipeForm';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Create({ draft }) {
    const ai = useForm({ keywords: '' });

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">レシピ作成</h2>}>
            <Head title="レシピ作成" />
            <div className="mx-auto max-w-3xl space-y-8 py-8 sm:px-6 lg:px-8">
                <section className="rounded-lg bg-white p-6 shadow-sm">
                    <h3 className="font-semibold text-gray-800">AI でレシピ案を作る</h3>
                    <p className="text-sm text-gray-500">キーワード（例: 鶏むね肉 時短 さっぱり）から下書きを生成し、フォームに反映します。</p>
                    <form
                        className="mt-3 flex gap-2"
                        onSubmit={(e) => {
                            e.preventDefault();
                            ai.post(route('recipes.suggest'));
                        }}
                    >
                        <TextInput className="w-full" value={ai.data.keywords} onChange={(e) => ai.setData('keywords', e.target.value)} />
                        <PrimaryButton disabled={ai.processing}>{ai.processing ? '生成中…' : '生成'}</PrimaryButton>
                    </form>
                    <InputError message={ai.errors.keywords} className="mt-2" />
                </section>

                <section className="rounded-lg bg-white p-6 shadow-sm">
                    {draft && <p className="mb-4 rounded bg-yellow-50 p-2 text-sm text-yellow-800">AI の下書きです。内容を確認・編集してから保存してください。</p>}
                    <RecipeForm key={draft?.title ?? 'blank'} initial={draft} method="post" action={route('recipes.store')} />
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
