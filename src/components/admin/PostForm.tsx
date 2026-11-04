'use client';

import { useState, useTransition, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ForwardRefEditor } from './ForwardRefEditor';
import type { MDXEditorMethods } from '@mdxeditor/editor';

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

  // Auto-generate slug from title when creating
  function handleTitleChange(val: string) {
    setTitle(val);
    if (action === 'create') {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-')
      );
    }
  }

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
          setError(data.error ?? 'Something went wrong while saving.');
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

        if (action === 'create') {
          router.push(`/admin/posts/${data.id}/edit`);
        }
        router.refresh();
      } catch {
        setError('Network error. Could not reach server.');
      }
    });
  }

  const isCurrentlyPublished = action === 'update' && !currentDraft;

  return (
    <form
      onKeyDown={(e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
          e.preventDefault();
          submit(currentDraft);
        }
      }}
      className="space-y-6"
    >
      {/* Publication Status Banner */}
      {action === 'update' && (
        <div
          className={`flex items-center justify-between p-3.5 rounded-lg border text-xs font-mono transition-colors ${
            isCurrentlyPublished
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
              : 'border-[var(--border-color)] bg-[var(--surface-bg)] text-[var(--text-muted)]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isCurrentlyPublished ? 'bg-emerald-400 animate-pulse' : 'bg-[var(--text-muted)]'
              }`}
            />
            <span className="font-semibold uppercase tracking-wider">
              Status: {isCurrentlyPublished ? 'Published & Live' : 'Draft (Private)'}
            </span>
          </div>
          <span className="hidden sm:inline text-xs opacity-80">
            {isCurrentlyPublished ? 'Publicly visible on blog and RSS feed' : 'Hidden from public readers'}
          </span>
        </div>
      )}

      {/* Success Notification */}
      {successMessage && (
        <div className="p-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-mono text-xs flex items-center justify-between">
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
      {/* Title */}
      <Field label="Title">
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Article title..."
          className={inputClass}
          required
        />
      </Field>

      {/* Slug */}
      <Field label="Slug" hint="URL-safe unique identifier">
        <div className="flex items-center rounded-md border border-[var(--border-color)] bg-[var(--surface-subtle)] focus-within:border-[var(--accent)] focus-within:ring-1 focus-within:ring-[var(--accent)] transition-all">
          <span className="pl-3 font-mono text-xs text-[var(--text-muted)] select-none">/posts/</span>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="article-slug"
            className="w-full bg-transparent px-2 py-2 font-mono text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
            required
          />
        </div>
      </Field>

      {/* Description */}
      <Field label="Description" hint="Excerpt used for card views, RSS, and SEO metadata">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief summary of the article..."
          rows={2}
          className={inputClass}
          required
        />
      </Field>

      {/* Content — Rich WYSIWYG Markdown Editor */}
      <Field label="Content" hint="WYSIWYG Markdown — type # for headings, - for lists, or use the toolbar">
        <ForwardRefEditor
          ref={editorRef}
          markdown={content}
          onChange={(newMarkdown) => setContent(newMarkdown)}
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Tags */}
        <Field label="Tags" hint="Comma-separated (e.g. Essays, Tech, Life, Culture)">
          <input
            type="text"
            value={tagsRaw}
            onChange={(e) => setTagsRaw(e.target.value)}
            placeholder="Essays, Design, Culture, Tech, Philosophy, Life"
            className={inputClass}
          />
        </Field>

        {/* Series */}
        <Field label="Series" hint="Optional thematic collection">
          <input
            type="text"
            value={series}
            onChange={(e) => setSeries(e.target.value)}
            placeholder="Field Studies, Life Notes, Ideas"
            className={inputClass}
          />
        </Field>
      </div>

      {/* Featured Checkbox */}
      <div className="p-4 rounded-lg border border-[var(--border-color)] bg-[var(--surface-bg)] flex items-center justify-between">
        <div>
          <label htmlFor="featured-toggle" className="font-sans text-sm font-medium text-[var(--text-primary)] cursor-pointer">
            Spotlight Feature
          </label>
          <p className="font-sans text-xs text-[var(--text-secondary)]">
            Pinned to the top masthead spotlight on the publication home.
          </p>
        </div>
        <input
          id="featured-toggle"
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="accent-[var(--accent)] w-4 h-4 cursor-pointer"
        />
      </div>

      {/* Error Message */}
      {error && (
        <p className="font-mono text-xs text-[var(--accent-secondary)]">{error}</p>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-[var(--border-color)]">
        <span className="font-mono text-xs text-[var(--text-muted)]">
          Shortcut: <kbd className="px-1.5 py-0.5 rounded bg-[var(--surface-subtle)] border border-[var(--border-color)] text-[var(--text-secondary)]">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-[var(--surface-subtle)] border border-[var(--border-color)] text-[var(--text-secondary)]">Enter</kbd> to save
        </span>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {isCurrentlyPublished ? (
            <>
              <button
                type="button"
                onClick={() => submit(true)}
                disabled={isPending}
                className="font-mono text-xs px-4 py-2 rounded-md border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 hover:border-amber-500/60 transition-all disabled:opacity-40"
              >
                {isPending ? 'Updating…' : 'Unpublish (Revert to Draft)'}
              </button>
              <button
                type="button"
                onClick={() => submit(false)}
                disabled={isPending}
                className="font-mono text-xs font-medium px-5 py-2 rounded-md bg-[var(--accent)] text-[var(--canvas-bg)] hover:opacity-90 transition-opacity disabled:opacity-40"
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
                className="font-mono text-xs px-4 py-2 rounded-md border border-[var(--border-color)] bg-[var(--surface-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-all disabled:opacity-40"
              >
                {isPending ? 'Saving…' : 'Save as Draft'}
              </button>
              <button
                type="button"
                onClick={() => submit(false)}
                disabled={isPending}
                className="font-mono text-xs font-medium px-5 py-2 rounded-md bg-[var(--accent)] text-[var(--canvas-bg)] hover:opacity-90 transition-opacity disabled:opacity-40"
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
  'w-full bg-[var(--surface-subtle)] border border-[var(--border-color)] rounded-md px-3.5 py-2 font-sans text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all';
