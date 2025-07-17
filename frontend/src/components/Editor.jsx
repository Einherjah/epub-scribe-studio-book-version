import React, { useState, useEffect, useRef } from 'react';
import { Box, Toolbar, Typography, ToggleButton, ToggleButtonGroup, Paper } from '@mui/material';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import CodeMirror from '@uiw/react-codemirror';
import { html as codeMirrorHtml } from '@codemirror/lang-html';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { EditorView } from '@codemirror/view';

import prettier from 'prettier/standalone';
import parserHtml from 'prettier/plugins/html';

// Componente da barra de ferramentas do Tiptap
const MenuBar = ({ editor }) => {
  if (!editor) return null;
  return (
    <Box sx={{ p: 1, borderBottom: '1px solid #ddd', minHeight: '42px', boxSizing: 'border-box', display: 'flex', alignItems: 'center' }}>
      <button onClick={() => editor.chain().focus().toggleBold().run()}>Bold</button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()}>Italic</button>
    </Box>
  );
};

// Componente da barra de ferramentas do CodeMirror (espaço reservado)
const CodeMirrorToolbar = () => {
    return (
        <Box sx={{ p: 1, borderBottom: '1px solid #333', minHeight: '42px', boxSizing: 'border-box' }} />
    );
}

function Editor({ chapter, onContentChange }) {
  const [view, setView] = useState('dividido');
  const [content, setContent] = useState('');

  // Lógica de formatação com Prettier (sem mudanças)
  const formatHtml = async (htmlString) => {
    if (htmlString === '<p></p>') return '';
    try {
      return await prettier.format(htmlString, {
        parser: 'html',
        plugins: [parserHtml],
        printWidth: 9999,
      });
    } catch (error) {
      return htmlString;
    }
  };

  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: async ({ editor }) => {
      const unformattedHtml = editor.getHTML();
      const formattedHtml = await formatHtml(unformattedHtml);
      setContent(formattedHtml);
      if (chapter) { onContentChange(formattedHtml, chapter.id); }
    },
  });

  // Efeitos para sincronizar o conteúdo (sem mudanças)
  useEffect(() => {
    const initializeContent = async () => {
        const initialContent = chapter ? chapter.content : '';
        const formattedContent = await formatHtml(initialContent);
        setContent(formattedContent);
        if (editor && !editor.isDestroyed && editor.getHTML() !== formattedContent) {
            editor.commands.setContent(formattedContent, false);
        }
    };
    if (chapter) { initializeContent(); } else { setContent(''); }
  }, [chapter]);
  
  useEffect(() => {
    if (editor && !editor.isDestroyed && editor.getHTML() !== content) {
        editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  const handleViewChange = (event, newView) => {
    if (newView !== null) { setView(newView); }
  };
  
  const handleCodeChange = (value) => {
    setContent(value);
    if (chapter) { onContentChange(value, chapter.id); }
  }

  if (!chapter) {
    return (
      <Box component="main" sx={{ flexGrow: 1, p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Toolbar />
        <Typography variant="h6" color="text.secondary">Selecione um capítulo para começar</Typography>
      </Box>
    );
  }

  // --- COMPONENTES INTERNOS FINAIS ---
  const TiptapEditorPanel = () => (
    <Paper variant="outlined" sx={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 2 }}>
      <Typography variant="h6" sx={{ p: 1.5, fontWeight: 500, borderBottom: '1px solid #ddd' }}>
        Editor Visual
      </Typography>
      <MenuBar editor={editor} />
      {/* O padding p:2 (16px) aqui serve como nossa referência de alinhamento */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, '& .ProseMirror': { outline: 'none' } }}>
        <EditorContent editor={editor} />
      </Box>
    </Paper>
  );

  const CodeMirrorPanel = () => (
    <Paper variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: 2, bgcolor: '#1e1e1e' }}>
      <Typography variant="h6" sx={{ p: 1.5, fontWeight: 500, borderBottom: '1px solid #333', color: 'white' }}>
        Editor de Código
      </Typography>
      <CodeMirrorToolbar />
      {/* O Box que envolve o CodeMirror. Sem padding para garantir cor uniforme. */}
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <CodeMirror
          value={content}
          height="100%"
          extensions={[
            codeMirrorHtml(),
            EditorView.lineWrapping,
            // AJUSTE FINAL: Criamos um tema customizado que força o padding interno
            // a ser exatamente igual ao do editor visual, garantindo o alinhamento.
            EditorView.theme({
              '&': {
                backgroundColor: '#1e1e1e' // Força o fundo a ser o mesmo do Paper
              },
              '.cm-scroller': {
                padding: '16px' // 16px equivale a p:2 do MUI
              }
            })
          ]}
          onChange={handleCodeChange}
          theme={vscodeDark}
        />
      </Box>
    </Paper>
  );

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
      <Toolbar />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexShrink: 0 }}>
        <Typography variant="h5">{chapter.shortTitle}</Typography>
        <ToggleButtonGroup size="small" value={view} exclusive onChange={handleViewChange}>
          <ToggleButton value="visual">Visual</ToggleButton>
          <ToggleButton value="codigo">Código</ToggleButton>
          <ToggleButton value="dividido">Dividido</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box sx={{ flexGrow: 1, display: 'flex', gap: 2, minHeight: 0 }}>
        { (view === 'visual' || view === 'dividido') &&
          <Box sx={{ width: view === 'dividido' ? '50%' : '100%', height: '100%' }}>
            <TiptapEditorPanel />
          </Box>
        }
        { (view === 'codigo' || view === 'dividido') &&
          <Box sx={{ width: view === 'dividido' ? '50%' : '100%', height: '100%' }}>
            <CodeMirrorPanel />
          </Box>
        }
      </Box>
    </Box>
  );
}

export default Editor;