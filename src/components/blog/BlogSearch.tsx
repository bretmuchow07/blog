'use client';

import React, { useState, useMemo } from 'react';
import type { PostWithTags } from '@/lib/types';
import PostCard from './PostCard';
import { Search, X } from 'lucide-react';

interface BlogSearchProps {
  initialPosts: PostWithTags[];
  availableTags: string[];
}

export default function BlogSearch({ initialPosts, availableTags }: BlogSearchProps) {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      const matchesQuery =
        query === '' ||
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.description.toLowerCase().includes(query.toLowerCase()) ||
        post.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));

      const matchesTag =
        selectedTag === null ||
        post.tags.map((t) => t.toLowerCase()).includes(selectedTag.toLowerCase());

      return matchesQuery && matchesTag;
    });
  }, [initialPosts, query, selectedTag]);

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by title, topic, or keyword..."
          className="w-full pl-10 pr-10 py-2.5 rounded-sm bg-[var(--surface-bg)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2 transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            aria-label="Clear search"
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Topic Filter Pills with Topic Dots */}
      {availableTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1 rounded-sm text-xs font-mono transition-colors flex items-center gap-1.5 ${
              selectedTag === null
                ? 'bg-[var(--text-primary)] text-[var(--canvas-bg)] font-semibold'
                : 'bg-[var(--surface-bg)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:border-[var(--border-hover)]'
            }`}
          >
            <span
              className={`topic-dot ${
                selectedTag === null ? 'bg-[var(--canvas-bg)]' : 'bg-[var(--accent)]'
              }`}
            />
            <span>All ({initialPosts.length})</span>
          </button>

          {availableTags.map((tag) => {
            const isSelected = selectedTag?.toLowerCase() === tag.toLowerCase();
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(isSelected ? null : tag)}
                className={`px-3 py-1 rounded-sm text-xs font-mono transition-colors flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[var(--text-primary)] text-[var(--canvas-bg)] font-semibold'
                    : 'bg-[var(--surface-bg)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:border-[var(--border-hover)]'
                }`}
              >
                <span
                  className={`topic-dot ${
                    isSelected ? 'bg-[var(--canvas-bg)]' : 'bg-[var(--accent-magenta)]'
                  }`}
                />
                <span>{tag}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Articles List */}
      <div className="pt-2 divide-y divide-[var(--border-color)]">
        {filteredPosts.length > 0 ? (
          <div>
            {filteredPosts.map((post, idx) => (
              <PostCard key={post.slug} post={post} index={idx} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-sm font-mono text-[var(--text-muted)] space-y-2">
            <p>No articles match your search.</p>
            <button
              onClick={() => {
                setQuery('');
                setSelectedTag(null);
              }}
              className="text-xs text-[var(--accent)] underline underline-offset-4 hover:opacity-80"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
