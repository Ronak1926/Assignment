import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2, { message: 'Name is required' }),
  leetcodeLink: z.string().optional(),
  youtubeLink: z.string().optional(),
  articleLink: z.string().optional(),
  level: z.enum(['EASY', 'MEDIUM', 'HARD']),
});

export type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: FormValues) => void;
  initialValues?: Partial<FormValues> | null;
  mode?: 'add' | 'edit';
}

const AddSubtopicModal: React.FC<Props> = ({ open, onClose, onSubmit, initialValues, mode = 'add' }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { level: 'EASY', ...(initialValues || {}) },
  });

  React.useEffect(() => {
    if (open) {
      reset({ level: 'EASY', ...(initialValues || {}) } as FormValues);
    }
  }, [open, initialValues, reset]);

  if (!open) return null;

  const submit = (data: FormValues) => {
    onSubmit(data);
    reset();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-1 text-xl font-semibold text-gray-900">{mode === 'edit' ? 'Edit Subtopic' : 'Add Subtopic'}</h2>
        <p className="mb-5 text-sm text-gray-500">Provide links and difficulty to keep track of this question.</p>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Enter subtopic/question title"
              {...register('name')}
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Level</label>
            <select
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              {...register('level')}
            >
              <option value="EASY">EASY</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HARD">HARD</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">LeetCode Link</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="https://leetcode.com/..."
              {...register('leetcodeLink')}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">YouTube Link</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="https://youtube.com/..."
              {...register('youtubeLink')}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Article Link</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="https://..."
              {...register('articleLink')}
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            >
              {mode === 'edit' ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubtopicModal;
