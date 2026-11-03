'use client';

import React, { useEffect, useState } from 'react';
import {
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  CodeMirrorEditor,
  tablePlugin,
  linkPlugin,
  linkDialogPlugin,
  toolbarPlugin,
  diffSourcePlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  CreateLink,
  InsertTable,
  InsertCodeBlock,
  ListsToggle,
  DiffSourceToggleWrapper,
  CodeToggle,
  ConditionalContents,
  ChangeCodeMirrorLanguage,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';

export interface EditorProps extends Omit<MDXEditorProps, 'plugins'> {
  editorRef?: React.Ref<MDXEditorMethods>;
}

const supportedCodeLanguages = {
  ts: 'TypeScript',
  tsx: 'TypeScript (React)',
  js: 'JavaScript',
  jsx: 'JavaScript (React)',
  html: 'HTML',
  css: 'CSS',
  json: 'JSON',
  sql: 'SQL',
  bash: 'Bash',
  shell: 'Shell',
  text: 'Plain Text',
  csharp: 'C#',
  dart: 'Dart',
  python: 'Python',
  rust: 'Rust',
  go: 'Go',
  yaml: 'YAML',
  xml: 'XML',
  markdown: 'Markdown',
  '': 'Plain Text',
};

export default function InitializedMDXEditor({
  editorRef,
  markdown,
  onChange,
  ...props
}: EditorProps) {
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      setIsLightMode(document.body.classList.contains('light-mode'));
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`mdx-editor-wrapper ${
        isLightMode ? 'light-theme' : 'dark-theme'
      } rounded-md border border-[var(--border-color)] bg-[var(--surface-bg)] overflow-hidden transition-all focus-within:border-[var(--accent)] focus-within:ring-1 focus-within:ring-[var(--accent)]`}
    >
      <MDXEditor
        ref={editorRef}
        markdown={markdown}
        onChange={onChange}
        contentEditableClassName={`prose ${
          isLightMode ? 'prose-neutral' : 'prose-invert'
        } max-w-none px-5 py-4 min-h-[380px] focus:outline-none text-[var(--text-primary)] font-sans leading-relaxed selection:bg-[var(--accent-secondary)]`}
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          codeBlockPlugin({
            defaultCodeBlockLanguage: 'text',
            codeBlockEditorDescriptors: [
              {
                priority: -1,
                match: () => true,
                Editor: CodeMirrorEditor,
              },
            ],
          }),
          codeMirrorPlugin({
            codeBlockLanguages: supportedCodeLanguages,
            autoLoadLanguageSupport: true,
          }),
          tablePlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          markdownShortcutPlugin(),
          diffSourcePlugin({ viewMode: 'rich-text' }),
          toolbarPlugin({
            toolbarContents: () => (
              <DiffSourceToggleWrapper>
                <div className="flex flex-wrap items-center gap-1 px-3 py-2 bg-[var(--surface-subtle)] border-b border-[var(--border-color)] text-xs">
                  <ConditionalContents
                    options={[
                      {
                        when: (editor) => editor?.editorType === 'codeblock',
                        contents: () => <ChangeCodeMirrorLanguage />,
                      },
                      {
                        fallback: () => (
                          <>
                            <UndoRedo />
                            <span className="w-px h-4 bg-[var(--border-color)] mx-1" />
                            <BlockTypeSelect />
                            <span className="w-px h-4 bg-[var(--border-color)] mx-1" />
                            <BoldItalicUnderlineToggles />
                            <CodeToggle />
                            <span className="w-px h-4 bg-[var(--border-color)] mx-1" />
                            <ListsToggle />
                            <CreateLink />
                            <InsertTable />
                            <InsertCodeBlock />
                          </>
                        ),
                      },
                    ]}
                  />
                </div>
              </DiffSourceToggleWrapper>
            ),
          }),
        ]}
        {...props}
      />
    </div>
  );
}
