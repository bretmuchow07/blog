'use client';

import dynamic from 'next/dynamic';
import React, { forwardRef } from 'react';
import type { MDXEditorMethods } from '@mdxeditor/editor';
import type { EditorProps } from './InitializedMDXEditor';

// Dynamically import InitializedMDXEditor to disable SSR for DOM/Lexical editor APIs
const Editor = dynamic(() => import('./InitializedMDXEditor'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-80 rounded-md border border-[var(--border-color)] bg-[var(--surface-bg)] flex items-center justify-center font-mono text-xs text-[var(--text-muted)] animate-pulse">
      Loading WYSIWYG Editor...
    </div>
  ),
});

export const ForwardRefEditor = forwardRef<MDXEditorMethods, EditorProps>((props, ref) => (
  <Editor {...props} editorRef={ref} />
));

ForwardRefEditor.displayName = 'ForwardRefEditor';
