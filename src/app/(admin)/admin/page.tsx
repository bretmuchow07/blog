import { getAllPostsAdmin } from '@/lib/posts';
import AdminArticleList from '@/components/admin/AdminArticleList';

export const metadata = { title: 'Admin — Articles' };
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const posts = await getAllPostsAdmin();

  return (
    <div className="space-y-8">
      {/* Header bar */}
      <div className="pb-6 border-b border-[var(--border-color)]">
        <h1 className="text-3xl font-sans font-bold text-[var(--text-primary)] tracking-tight">
          Articles
        </h1>
        <p className="text-sm font-sans text-[var(--text-secondary)] mt-1">
          Manage drafts, schedule updates, and publish content to the live blog.
        </p>
      </div>

      <AdminArticleList initialPosts={posts} />
    </div>
  );
}
