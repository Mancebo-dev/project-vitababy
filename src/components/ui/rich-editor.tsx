"use client";

import { type Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  FileText,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
} from "lucide-react";
import { forwardRef, useEffect, useState } from "react";

const MenuBar = ({
  editor,
  a4Mode = false,
}: {
  editor: Editor | null;
  a4Mode?: boolean;
}) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-1 border-b border-slate-200 p-2.5 bg-white/95 backdrop-blur-xs rounded-t-lg shadow-xs">
      <div className="flex flex-wrap items-center gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-md transition-colors ${
            editor.isActive("bold")
              ? "bg-primary/15 text-primary font-bold"
              : "text-slate-600 hover:bg-slate-100"
          }`}
          title="Negrito"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-md transition-colors ${
            editor.isActive("italic")
              ? "bg-primary/15 text-primary"
              : "text-slate-600 hover:bg-slate-100"
          }`}
          title="Itálico"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`p-1.5 rounded-md transition-colors ${
            editor.isActive("strike")
              ? "bg-primary/15 text-primary"
              : "text-slate-600 hover:bg-slate-100"
          }`}
          title="Tachado"
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-200 mx-1 self-center" />

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`p-1.5 rounded-md transition-colors ${
            editor.isActive("heading", { level: 2 })
              ? "bg-primary/15 text-primary font-bold"
              : "text-slate-600 hover:bg-slate-100"
          }`}
          title="Título Principal (H2)"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`p-1.5 rounded-md transition-colors ${
            editor.isActive("heading", { level: 3 })
              ? "bg-primary/15 text-primary font-bold"
              : "text-slate-600 hover:bg-slate-100"
          }`}
          title="Subtítulo (H3)"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-200 mx-1 self-center" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded-md transition-colors ${
            editor.isActive("bulletList")
              ? "bg-primary/15 text-primary"
              : "text-slate-600 hover:bg-slate-100"
          }`}
          title="Lista com Marcadores"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded-md transition-colors ${
            editor.isActive("orderedList")
              ? "bg-primary/15 text-primary"
              : "text-slate-600 hover:bg-slate-100"
          }`}
          title="Lista Numerada"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
      </div>

      {a4Mode && (
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
          <FileText className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-medium">Formato A4 (210 × 297 mm)</span>
        </div>
      )}
    </div>
  );
};

function TipTapInner({
  value,
  onChange,
  a4Mode = true,
}: {
  value: string;
  onChange: (val: string) => void;
  a4Mode?: boolean;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: a4Mode
          ? "prose prose-slate max-w-none focus:outline-none w-full min-h-[297mm] p-8 sm:p-14 text-slate-800 text-[14px] sm:text-[15px] leading-relaxed select-text [&_*]:max-w-none [&_div]:w-full"
          : "prose prose-sm sm:prose-base max-w-none focus:outline-none w-full min-h-[300px] max-h-[500px] overflow-y-auto p-4 [&_*]:max-w-none [&_div]:w-full",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
  });

  if (a4Mode) {
    return (
      <div className="w-full flex flex-col items-center">
        {/* Folha A4 */}
        <div className="w-full max-w-[210mm] min-h-[297mm] bg-white border border-slate-300 shadow-xl rounded-xs flex flex-col overflow-hidden my-2">
          <MenuBar editor={editor} a4Mode={true} />
          <div className="flex-1 w-full bg-white">
            <EditorContent editor={editor} className="w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-md bg-white overflow-hidden shadow-sm">
      <MenuBar editor={editor} a4Mode={false} />
      <EditorContent editor={editor} className="w-full" />
    </div>
  );
}

export const RichEditor = forwardRef<
  HTMLDivElement,
  {
    value: string;
    onChange: (val: string) => void;
    a4Mode?: boolean;
  }
>(({ value, onChange, a4Mode = true }, ref) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div ref={ref} className="w-full flex flex-col items-center">
        <div
          className={
            a4Mode
              ? "w-full max-w-[210mm] min-h-[200px] bg-slate-50 border border-slate-200 rounded-lg p-8 flex items-center justify-center text-slate-400 text-xs font-medium"
              : "w-full min-h-[150px] bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center justify-center text-slate-400 text-xs font-medium"
          }
        >
          Carregando editor...
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="w-full">
      <TipTapInner value={value} onChange={onChange} a4Mode={a4Mode} />
    </div>
  );
});

RichEditor.displayName = "RichEditor";
