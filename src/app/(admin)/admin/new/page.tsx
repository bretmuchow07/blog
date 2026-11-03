import PostForm from '@/components/admin/PostForm';

export const metadata = { title: 'Admin — New Article' };

export default function NewPostPage() {
  return (
    <div className="space-y-8">
      <div className="pb-6 border-b border-[var(--border-color)]">
        <h1 className="text-2xl font-sans font-bold text-[var(--text-primary)] tracking-tight">
          New Article
        </h1>
        <p className="text-sm font-sans text-[var(--text-secondary)] mt-1">
          Draft and format content using the visual Markdown editor.
        </p>
      </div>
      <PostForm action="create" />
    </div>
  );
}
