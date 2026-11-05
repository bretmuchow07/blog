'use client';

import { useState, useTransition, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ForwardRefEditor } from './ForwardRefEditor';
import type { MDXEditorMethods } from '@mdxeditor/editor';
import {
  ExternalLink,
  Copy,
  Check,
  RotateCcw,
  Trash2,
  ArrowLeft,
  Clock,
  FileText,
  Sparkles,
} from 'lucide-react';

interface PostFormProps {
  initialValues?: {
    id?: string;
    slug?: string;
    title?: string;
    description?: string;
    content?: string;
    tags?: string[];
    series?: string;
    featured?: boolean;
    draft?: boolean;
  };
  action: 'create' | 'update';
}

const COMMON_TAGS = [
  'Software',
  'Architecture',
  'Design',
  'Essays',
  'Systems',
  'Life',
  'Culture',
  'Tools',
];

export default function PostForm({ initialValues = {}, action }: PostFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const editorRef = useRef<MDXEditorMethods>(null);

  const [title, setTitle] = useState(initialValues.title ?? '');
  const [slug, setSlug] = useState(initialValues.slug ?? '');
  const [description, setDescription] = useState(initialValues.description ?? '');
  const [content, setContent] = useState(initialValues.content ?? '');
  const [tagsRaw, setTagsRaw] = useState((initialValues.tags ?? []).join(', '));
  const [series, setSeries] = useState(initialValues.series ?? '');
  const [featured, setFeatured] = useState(initialValues.featured ?? false);
  const [currentDraft, setCurrentDraft] = useState(initialValues.draft ?? true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Deletion state
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Auto-generate slug from text
  function slugify(text: string) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  }

  function handleTitleChange(val: string) {
    setTitle(val);
    if (action === 'create') {
      setSlug(slugify(val));
    }
  }

  function syncSlugWithTitle() {
    if (title.trim()) {
      setSlug(slugify(title));
    }
  }

  function handleCopyUrl() {
    if (!slug) return;
    const url = `https://blog.bretmuchoni.dev/posts/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  }

  // Tag chip toggle
  function toggleTagChip(tag: string) {
    const existing = tagsRaw
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (existing.some((t) => t.toLowerCase() === tag.toLowerCase())) {
      setTagsRaw(existing.filter((t) => t.toLowerCase() !== tag.toLowerCase()).join(', '));
    } else {
      setTagsRaw([...existing, tag].join(', '));
    }
  }

  // Telemetry computation
  const stats = useMemo(() => {
    const raw = (content || '').trim();
    const words = raw ? raw.split(/\s+/).filter(Boolean).length : 0;
    const minutes = Math.max(1, Math.ceil(words / 200));
    const chars = raw.length;
    return { words, readingTime: `${minutes} min read`, chars };
  }, [content]);

  async function submit(asDraft: boolean) {
    setError('');
    setSuccessMessage('');
    const tags = tagsRaw
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const body = {
      id: initialValues.id,
      slug,
      title,
      description,
      content,
      tags,
      series: series || undefined,
      featured,
      draft: asDraft,
    };

    startTransition(async () => {
      try {
        const res = await fetch(
          action === 'create' ? '/api/admin/posts' : `/api/admin/posts/${initialValues.id}`,
          {
            method: action === 'create' ? 'POST' : 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          }
        );

        if (!res.ok) {
          const data = (await res.json()) as { error?: string };
          setError(typeof data.error === 'string' ? data.error : 'Validation failed. Check your inputs.');
          return;
        }

        const data = (await res.json()) as { id?: string; draft?: boolean };
        setCurrentDraft(Boolean(data.draft));
        setSuccessMessage(
          asDraft
            ? action === 'update' && !currentDraft
              ? 'Article unpublished and reverted to draft.'
              : 'Draft saved successfully.'
            : 'Article published live!'
        );

        if (action === 'create' && data.id) {
          router.push(`/admin/posts/${data.id}/edit`);
        }
        router.refresh();
      } catch {
        setError('Network error. Could not reach server.');
      }
    });
  }

  async function handleDeleteArticle() {
    if (!initialValues.id) return;
    setIsDeleting(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/posts/${initialValues.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || 'Failed to delete article.');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error deleting article.');
      setIsDeleting(false);
      setIsConfirmingDelete(false);
    }
  }

  const isCurrentlyPublished = action === 'update' && !currentDraft;

  return (
    <form
      onKeyDown={(e) => {
        if ((e.metaKey || e.ctrlKey) && (e.key === 's' || e.key === 'Enter')) {
          e.preventDefault();
          submit(currentDraft);
        }
      }}
      className="space-y-8"
    >
      {/* Top Header & Quick Status Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-md border border-[var(--border-color)] bg-[var(--surface-bg)]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)] rounded-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Articles</span>
          </Link>

          <span className="text-[var(--border-color)]">|</span>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                isCurrentlyPublished ? 'bg-[var(--accent)] animate-pulse' : 'bg-[var(--text-muted)]'
              }`}
            />
            <span className="font-semibold uppercase tracking-wider text-[var(--text-primary)]">
              {action === 'create'
                ? 'New Draft'
                : isCurrentlyPublished
                ? 'Published & Live'
                : 'Draft Mode'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isCurrentlyPublished && slug && (
            <Link
              href={`/posts/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm font-mono text-xs text-[var(--accent)] border border-[var(--border-accent)] bg-[var(--accent)]/5 hover:bg-[var(--accent)]/10 transition-colors"
            >
              <span>View live</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          )}

          <span className="font-mono text-xs text-[var(--text-muted)] hidden md:inline">
            <kbd className="px-1.5 py-0.5 rounded-sm bg-[var(--surface-subtle)] border border-[var(--border-color)] text-[var(--text-secondary)]">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded-sm bg-[var(--surface-subtle)] border border-[var(--border-color)] text-[var(--text-secondary)]">S</kbd> to save
          </span>
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-3.5 rounded-md border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-mono text-xs flex items-center justify-between">
          <span>✓ {successMessage}</span>
          <button
            type="button"
            onClick={() => setSuccessMessage('')}
            className="text-emerald-400 hover:text-emerald-200"
          >
            ✕
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3.5 rounded-md border border-[var(--accent-magenta)]/40 bg-[var(--accent-magenta)]/10 text-[var(--accent-magenta)] font-mono text-xs flex items-center justify-between">
          <span>✕ {error}</span>
          <button
            type="button"
            onClick={() => setError('')}
            className="text-xs underline hover:opacity-80"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Title */}
      <Field label="Article Title" hint="Primary headline in Space Grotesk">
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="e.g. Architectural Foundations of Distributed Systems..."
          className={inputClass}
          required
        />
      </Field>

      {/* Slug & Canonical URL Preview */}
      <Field label="URL Slug" hint="Unique URL path identifier">
        <div className="space-y-1.5">
          <div className="flex items-center rounded-sm border border-[var(--border-color)] bg-[var(--surface-subtle)] focus-within:border-[var(--accent)] focus-within:ring-1 focus-within:ring-[var(--accent)] transition-all">
            <span className="pl-3 font-mono text-xs text-[var(--text-muted)] select-none">/posts/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="article-slug"
              className="w-full bg-transparent px-2 py-2 font-mono text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
              required
            />
            {action === 'update' && (
              <button
                type="button"
                onClick={syncSlugWithTitle}
                title="Regenerate slug from current title"
                className="px-2.5 py-1 mr-1 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-bg)] rounded-sm transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {slug && (
            <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] px-1">
              <span className="truncate">
                Canonical: <span className="text-[var(--text-secondary)]">https://blog.bretmuchoni.dev/posts/{slug}</span>
              </span>
              <button
                type="button"
                onClick={handleCopyUrl}
                className="hover:text-[var(--text-primary)] inline-flex items-center gap-1 transition-colors shrink-0 ml-2"
              >
                {copiedUrl ? (
                  <>
                    <Check className="w-3 h-3 text-[var(--accent)]" />
                    <span className="text-[10px] text-[var(--accent)]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span className="text-[10px]">Copy</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </Field>

      {/* Description */}
      <Field label="Summary Excerpt" hint="Short one or two-line brief for cards, RSS feed, and previews">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A brief summary explaining the core concept of the piece..."
          rows={2}
          className={inputClass}
          required
        />
      </Field>

      {/* Content Editor with Writing Telemetry */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)]">
            Content
          </label>

          {/* Telemetry Strip */}
          <div className="flex items-center gap-3 text-xs font-mono text-[var(--text-muted)]">
            <span className="inline-flex items-center gap-1">
              <FileText className="w-3 h-3" />
              <span>{stats.words.toLocaleString()} words</span>
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{stats.readingTime}</span>
            </span>
          </div>
        </div>

        <ForwardRefEditor
          ref={editorRef}
          markdown={content}
          onChange={(newMarkdown) => setContent(newMarkdown)}
        />
      </div>

      {/* Tags and Tag Suggestions */}
      <div className="space-y-2">
        <Field label="Topics & Tags" hint="Comma-separated tags">
          <input
            type="text"
            value={tagsRaw}
            onChange={(e) => setTagsRaw(e.target.value)}
            placeholder="Software, Architecture, Essays, Design..."
            className={inputClass}
          />
        </Field>

        {/* Quick Tag Suggestions */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-xs font-mono text-[var(--text-muted)] mr-1">Suggestions:</span>
          {COMMON_TAGS.map((tag) => {
            const isSelected = tagsRaw
              .split(',')
              .map((t) => t.trim().toLowerCase())
              .includes(tag.toLowerCase());
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTagChip(tag)}
                className={`px-2 py-0.5 rounded-sm font-mono text-xs transition-colors ${
                  isSelected
                    ? 'bg-[var(--accent)] text-[var(--canvas-bg)] font-semibold'
                    : 'bg-[var(--surface-bg)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:border-[var(--border-hover)]'
                }`}
              >
                {isSelected ? `✓ ${tag}` : `+ ${tag}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Series & Featured Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Series */}
        <Field label="Series Collection" hint="Optional series grouping">
          <input
            type="text"
            value={series}
            onChange={(e) => setSeries(e.target.value)}
            placeholder="e.g. Field Studies, Systems Notes"
            className={inputClass}
          />
        </Field>

        {/* Featured Toggle */}
        <div className="p-3.5 rounded-md border border-[var(--border-color)] bg-[var(--surface-bg)] flex items-center justify-between">
          <div className="space-y-0.5">
            <label htmlFor="featured-toggle" className="font-sans text-sm font-medium text-[var(--text-primary)] cursor-pointer flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Spotlight Feature</span>
            </label>
            <p className="font-sans text-xs text-[var(--text-muted)]">
              Pinned to the top spotlight on the publication index.
            </p>
          </div>
          <input
            id="featured-toggle"
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="accent-[var(--accent)] w-4 h-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
          />
        </div>
      </div>

      {/* Action and Danger Zone */}
      <div className="pt-6 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Delete button or Cancel link */}
        {action === 'update' ? (
          <div>
            {isConfirmingDelete ? (
              <div className="flex items-center gap-2 p-2 rounded-sm border border-[var(--accent-magenta)]/40 bg-[var(--accent-magenta)]/10">
                <span className="font-mono text-xs text-[var(--accent-magenta)]">
                  Permanently delete this article?
                </span>
                <button
                  type="button"
                  onClick={handleDeleteArticle}
                  disabled={isDeleting}
                  className="px-2.5 py-1 rounded-sm font-mono text-xs bg-[var(--accent-magenta)] text-white hover:opacity-90 disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting…' : 'Confirm Delete'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsConfirmingDelete(false)}
                  disabled={isDeleting}
                  className="px-2 py-1 rounded-sm font-mono text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-sm font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent-magenta)] hover:bg-[var(--surface-subtle)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent-magenta)]"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Article</span>
              </button>
            )}
          </div>
        ) : (
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 font-mono text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
          >
            ← Discard & return to articles
          </Link>
        )}

        {/* Primary Save & Publish Buttons */}
        <div className="flex items-center gap-3 justify-end flex-wrap">
          {isCurrentlyPublished ? (
            <>
              <button
                type="button"
                onClick={() => submit(true)}
                disabled={isPending}
                className="font-mono text-xs px-4 py-2 rounded-sm border border-[var(--accent-yellow)]/40 bg-[var(--accent-yellow)]/10 text-[var(--accent-yellow)] hover:bg-[var(--accent-yellow)]/20 transition-all disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-[var(--accent-yellow)]"
              >
                {isPending ? 'Updating…' : 'Revert to Draft'}
              </button>
              <button
                type="button"
                onClick={() => submit(false)}
                disabled={isPending}
                className="font-mono text-xs font-semibold px-5 py-2 rounded-sm bg-[var(--accent)] text-[var(--canvas-bg)] hover:opacity-90 transition-opacity disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
              >
                {isPending ? 'Saving…' : 'Save Changes'}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => submit(true)}
                disabled={isPending}
                className="font-mono text-xs px-4 py-2 rounded-sm border border-[var(--border-color)] bg-[var(--surface-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-all disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
              >
                {isPending ? 'Saving…' : 'Save as Draft'}
              </button>
              <button
                type="button"
                onClick={() => submit(false)}
                disabled={isPending}
                className="font-mono text-xs font-semibold px-5 py-2 rounded-sm bg-[var(--accent)] text-[var(--canvas-bg)] hover:opacity-90 transition-opacity disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
              >
                {isPending ? 'Publishing…' : 'Publish Article'}
              </button>
            </>
          )}
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <label className="font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)]">
          {label}
        </label>
        {hint && (
          <span className="font-mono text-xs text-[var(--text-muted)]">{hint}</span>
        )}
      </div>
      {children}
    </div>
  );
}

const inputClass =
  'w-full bg-[var(--surface-subtle)] border border-[var(--border-color)] rounded-sm px-3.5 py-2 font-sans text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] focus-visible:outline-2 focus-visible:outline-[var(--accent)] transition-all';
