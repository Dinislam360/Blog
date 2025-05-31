
'use client';

import type { FC } from 'react';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, Strikethrough, Heading1, Heading2, Heading3, Pilcrow, List, ListOrdered, Undo, Redo, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const TiptapToolbar: FC<{ editor: Editor | null }> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 border border-input bg-transparent p-2 rounded-t-md">
      <Button
        type="button"
        variant={editor.isActive('bold') ? 'secondary' : 'ghost'}
        size="icon"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        title="Bold (Ctrl+B)"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('italic') ? 'secondary' : 'ghost'}
        size="icon"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        title="Italic (Ctrl+I)"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('strike') ? 'secondary' : 'ghost'}
        size="icon"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        title="Strikethrough (Ctrl+Shift+X)"
      >
        <Strikethrough className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('heading', { level: 1 }) ? 'secondary' : 'ghost'}
        size="icon"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        title="Heading 1 (Ctrl+Alt+1)"
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('heading', { level: 2 }) ? 'secondary' : 'ghost'}
        size="icon"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        title="Heading 2 (Ctrl+Alt+2)"
      >
        <Heading2 className="h-4 w-4" />
      </Button>
       <Button
        type="button"
        variant={editor.isActive('heading', { level: 3 }) ? 'secondary' : 'ghost'}
        size="icon"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        title="Heading 3 (Ctrl+Alt+3)"
      >
        <Heading3 className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('paragraph') ? 'secondary' : 'ghost'}
        size="icon"
        onClick={() => editor.chain().focus().setParagraph().run()}
        title="Paragraph (Ctrl+Alt+0)"
      >
        <Pilcrow className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('bulletList') ? 'secondary' : 'ghost'}
        size="icon"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="Bullet List (Ctrl+Shift+8)"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('orderedList') ? 'secondary' : 'ghost'}
        size="icon"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title="Ordered List (Ctrl+Shift+7)"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
       <Button
        type="button"
        variant={editor.isActive('blockquote') ? 'secondary' : 'ghost'}
        size="icon"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        title="Blockquote (Ctrl+Shift+B)"
      >
        <Quote className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Undo (Ctrl+Z)"
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Redo (Ctrl+Y)"
      >
        <Redo className="h-4 w-4" />
      </Button>
    </div>
  );
};


export const RichTextEditor: FC<RichTextEditorProps> = ({ value, onChange, disabled }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Configure heading levels if needed, e.g., heading: { levels: [1, 2, 3] }
        // Disable specific nodes/marks if necessary, e.g. codeBlock: false,
      }),
      Placeholder.configure({
        placeholder: 'Write your blog post content here...',
      }),
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm sm:prose-base dark:prose-invert max-w-none', // Tailwind prose classes for styling editor content
          'min-h-[250px] w-full rounded-b-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
          'border-t-0' // Remove top border as toolbar has bottom border
        ),
      },
    },
  });

  return (
    <div className="flex flex-col">
      <TiptapToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};
