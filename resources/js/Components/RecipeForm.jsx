import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';

const blank = {
    title: '',
    description: '',
    servings: '',
    cook_minutes: '',
    ingredients: [{ name: '', amount: '' }],
    steps: [''],
};

export default function RecipeForm({ initial, method, action }) {
    const { data, setData, post, put, processing, errors } = useForm({
        ...blank,
        ...initial,
        description: initial?.description ?? '',
        servings: initial?.servings ?? '',
        cook_minutes: initial?.cook_minutes ?? '',
    });

    const setIng = (i, key, v) =>
        setData('ingredients', data.ingredients.map((x, j) => (j === i ? { ...x, [key]: v } : x)));
    const setStep = (i, v) => setData('steps', data.steps.map((x, j) => (j === i ? v : x)));
    const remove = (key, i) => setData(key, data[key].filter((_, j) => j !== i));

    const submit = (e) => {
        e.preventDefault();
        (method === 'put' ? put : post)(action);
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div>
                <InputLabel htmlFor="title" value="タイトル" />
                <TextInput id="title" className="mt-1 block w-full" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                <InputError message={errors.title} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="description" value="説明" />
                <textarea id="description" rows="2" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" value={data.description} onChange={(e) => setData('description', e.target.value)} />
                <InputError message={errors.description} className="mt-2" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <InputLabel htmlFor="servings" value="人数" />
                    <TextInput id="servings" type="number" className="mt-1 block w-full" value={data.servings} onChange={(e) => setData('servings', e.target.value)} />
                    <InputError message={errors.servings} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="cook_minutes" value="調理時間(分)" />
                    <TextInput id="cook_minutes" type="number" className="mt-1 block w-full" value={data.cook_minutes} onChange={(e) => setData('cook_minutes', e.target.value)} />
                    <InputError message={errors.cook_minutes} className="mt-2" />
                </div>
            </div>

            <div>
                <InputLabel value="材料" />
                {data.ingredients.map((ing, i) => (
                    <div key={i} className="mt-2 flex gap-2">
                        <TextInput placeholder="材料名" className="w-2/3" value={ing.name} onChange={(e) => setIng(i, 'name', e.target.value)} />
                        <TextInput placeholder="分量" className="w-1/3" value={ing.amount} onChange={(e) => setIng(i, 'amount', e.target.value)} />
                        <SecondaryButton type="button" onClick={() => remove('ingredients', i)} disabled={data.ingredients.length === 1}>削除</SecondaryButton>
                    </div>
                ))}
                <InputError message={errors.ingredients} className="mt-2" />
                <SecondaryButton type="button" className="mt-2" onClick={() => setData('ingredients', [...data.ingredients, { name: '', amount: '' }])}>＋ 材料を追加</SecondaryButton>
            </div>

            <div>
                <InputLabel value="手順" />
                {data.steps.map((st, i) => (
                    <div key={i} className="mt-2 flex gap-2">
                        <span className="w-6 pt-2 text-gray-500">{i + 1}.</span>
                        <textarea rows="2" className="block w-full rounded-md border-gray-300 shadow-sm" value={st} onChange={(e) => setStep(i, e.target.value)} />
                        <SecondaryButton type="button" onClick={() => remove('steps', i)} disabled={data.steps.length === 1}>削除</SecondaryButton>
                    </div>
                ))}
                <InputError message={errors.steps} className="mt-2" />
                <SecondaryButton type="button" className="mt-2" onClick={() => setData('steps', [...data.steps, ''])}>＋ 手順を追加</SecondaryButton>
            </div>

            <PrimaryButton disabled={processing}>保存</PrimaryButton>
        </form>
    );
}
