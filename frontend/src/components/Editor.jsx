import React from 'react';
import { Box, Toolbar, Typography, ToggleButton, ToggleButtonGroup, Paper, Tooltip, IconButton, Divider } from '@mui/material';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
// A CORREÇÃO ESTÁ AQUI: Adicionamos as chaves {}
import { TextStyle } from '@tiptap/extension-text-style';
import { FontSize } from '@tiptap/extension-font-size';

import CodeMirror from '@uiw/react-codemirror';
import { html as codeMirrorHtml } from '@codemirror/lang-html';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { EditorView } from '@codemirror/view';

import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatStrikethroughIcon from '@mui/icons-material/FormatStrikethrough';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';


const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const alignmentOptions = [
    { type: 'left', icon: <FormatAlignLeftIcon />, title: 'Alinhar à Esquerda' },
    { type: 'center', icon: <FormatAlignCenterIcon />, title: 'Centralizar' },
    { type: 'right', icon: <FormatAlignRightIcon />, title: 'Alinhar à Direita' },
    { type: 'justify', icon: <FormatAlignJustifyIcon />, title: 'Justificar' },
  ];

  const getHeadingLevel = () => {
    for (let i = 1; i <= 5; i++) {
      if (editor.isActive('heading', { level: i })) { return i; }
    }
    return 0;
  };
  
  const fontSizes = ['12px', '14px', '16px', '18px', '24px', '32px'];
  // Corrigindo para verificar se textStyle existe antes de acessar fontSize
  const currentFontSize = editor.getAttributes('textStyle')?.fontSize || '16px';

  return (
    <Box sx={{ p: 0.5, borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
      <select
        value={getHeadingLevel()}
        onChange={(e) => {
          const level = parseInt(e.target.value, 10);
          const command = editor.chain().focus();
          if (level === 0) { command.setParagraph().run(); } else { command.toggleHeading({ level }).run(); }
        }}
        style={{ marginRight: '8px', padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }}
      >
        <option value={0}>Parágrafo</option>
        <option value={1}>Título 1</option>
        <option value={2}>Título 2</option>
        <option value={3}>Título 3</option>
        <option value={4}>Título 4</option>
        <option value={5}>Título 5</option>
      </select>
      
      <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 0.5 }} />

      <select
        value={currentFontSize}
        onChange={(e) => {
          const size = e.target.value;
          editor.chain().focus().setFontSize(size).run();
        }}
        style={{ marginRight: '8px', padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }}
      >
        {fontSizes.map(size => (
          <option key={size} value={size}>{size.replace('px', '')}</option>
        ))}
      </select>

      <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 0.5 }} />

      <Tooltip title="Negrito" arrow enterDelay={500}><IconButton size="small" onClick={() => editor.chain().focus().toggleBold().run()}><FormatBoldIcon /></IconButton></Tooltip>
      <Tooltip title="Itálico" arrow enterDelay={500}><IconButton size="small" onClick={() => editor.chain().focus().toggleItalic().run()}><FormatItalicIcon /></IconButton></Tooltip>
      <Tooltip title="Riscado" arrow enterDelay={500}><IconButton size="small" onClick={() => editor.chain().focus().toggleStrike().run()}><FormatStrikethroughIcon /></IconButton></Tooltip>
      <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 0.5 }} />
      {alignmentOptions.map(opt => (
        <Tooltip title={opt.title} arrow enterDelay={500} key={opt.type}>
          <IconButton size="small" onClick={() => editor.chain().focus().setTextAlign(opt.type).run()}>{opt.icon}</IconButton>
        </Tooltip>
      ))}
      <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 0.5 }} />
      <Tooltip title="Lista com Marcadores" arrow enterDelay={500}><IconButton size="small" onClick={() => editor.chain().focus().toggleBulletList().run()}><FormatListBulletedIcon /></IconButton></Tooltip>
    </Box>
  );
};

const CodeMirrorToolbar = () => <Box sx={{ p: 1, borderBottom: '1px solid #333', height: '50px', boxSizing: 'border-box' }} />;

function Editor({ chapter, onContentChange }) {
  const [view, setView] = React.useState('dividido');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4, 5] } }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      FontSize,
    ],
    content: chapter ? chapter.content : '',
    onUpdate: ({ editor }) => {
      if (chapter) { onContentChange(editor.getHTML(), chapter.id); }
    },
  }, [chapter?.id]);

  const handleViewChange = (event, newView) => {
    if (newView !== null) { setView(newView); }
  };
  
  const handleCodeChange = (value) => {
    if (editor && !editor.isDestroyed) {
      editor.commands.setContent(value, false);
    }
    if (chapter) { onContentChange(value, chapter.id); }
  };

  if (!chapter) {
    return (
      <Box component="main" sx={{ flexGrow: 1, p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6" color="text.secondary">Selecione um capítulo para começar</Typography>
      </Box>
    );
  }

  const TiptapEditorPanel = () => (
    <Paper variant="outlined" sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Typography variant="h6" sx={{ p: 1.5, fontWeight: 500, borderBottom: '1px solid #ddd' }}>
        Editor Visual
      </Typography>
      <MenuBar editor={editor} />
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, userSelect: 'text', '& .ProseMirror': { outline: 'none' } }}>
        <EditorContent editor={editor} />
      </Box>
    </Paper>
  );

  const CodeMirrorPanel = () => (
    <Paper variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#1e1e1e' }}>
      <Typography variant="h6" sx={{ p: 1.5, fontWeight: 500, borderBottom: '1px solid #333', color: 'white' }}>
        Editor de Código
      </Typography>
      <CodeMirrorToolbar />
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
        <CodeMirror
          value={chapter.content}
          height="100%"
          extensions={[ codeMirrorHtml(), EditorView.lineWrapping, EditorView.theme({'.cm-scroller': { paddingTop: '36px' }}) ]}
          onChange={handleCodeChange}
          theme={vscodeDark}
        />
      </Box>
    </Paper>
  );

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
      <Toolbar />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">{chapter.shortTitle}</Typography>
        <ToggleButtonGroup size="small" value={view} exclusive onChange={handleViewChange}>
          <ToggleButton value="visual">Visual</ToggleButton>
          <ToggleButton value="codigo">Código</ToggleButton>
          <ToggleButton value="dividido">Dividido</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box sx={{ flexGrow: 1, display: 'flex', gap: 2, minHeight: 0 }}>
        { (view === 'visual' || view === 'dividido') &&
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <TiptapEditorPanel />
          </Box>
        }
        { (view === 'codigo' || view === 'dividido') &&
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <CodeMirrorPanel />
          </Box>
        }
      </Box>
    </Box>
  );
}

export default Editor;