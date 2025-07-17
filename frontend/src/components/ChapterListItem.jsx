// CÓDIGO COMPLETO PARA ChapterListItem.jsx
import React, { useState, useEffect } from 'react';
import { ListItem, ListItemText, TextField, IconButton, Box, Tooltip } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function ChapterListItem({ chapter, onSelect, onDelete, onRename }) {
  const [isEditing, setIsEditing] = useState(false);
  const [shortTitle, setShortTitle] = useState(chapter.shortTitle);
  const [longTitle, setLongTitle] = useState(chapter.longTitle);

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: chapter.id });
  const style = { transform: CSS.Transform.toString(transform), transition, };

  useEffect(() => {
    setShortTitle(chapter.shortTitle);
    setLongTitle(chapter.longTitle);
  }, [chapter]);

  const handleDoubleClick = () => { setIsEditing(true); };
  const handleSave = () => {
    setIsEditing(false);
    const newTitles = { shortTitle, longTitle };
    if (newTitles.shortTitle !== chapter.shortTitle || newTitles.longTitle !== chapter.longTitle) {
      onRename(chapter.id, newTitles);
    }
  };
  const handleKeyDown = (e) => { if (e.key === 'Enter') { e.preventDefault(); handleSave(); } };

  return (
    <ListItem ref={setNodeRef} style={style} disablePadding secondaryAction={ !isEditing && (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title={chapter.longTitle} placement="top" arrow>
            <IconButton aria-label="informação"><InfoOutlinedIcon fontSize="small" /></IconButton>
          </Tooltip>
          <IconButton edge="end" aria-label="delete" onClick={() => onDelete(chapter.id)}><DeleteOutlineIcon fontSize="small" /></IconButton>
        </Box>
      )}>
      {isEditing ? (
        <Box sx={{ p: 1, width: '100%' }}>
          <TextField label="Título Curto" value={shortTitle} onChange={(e) => setShortTitle(e.target.value)} onKeyDown={handleKeyDown} size="small" variant="outlined" autoFocus fullWidth />
          <TextField label="Título Completo" value={longTitle} onChange={(e) => setLongTitle(e.target.value)} onKeyDown={handleKeyDown} onBlur={handleSave} size="small" variant="outlined" fullWidth sx={{ mt: 1 }} />
        </Box>
      ) : (
        <Box onDoubleClick={handleDoubleClick} sx={{ display: 'flex', alignItems: 'center', width: '100%', pl: 1 }}>
          <Box {...listeners} {...attributes} sx={{ cursor: 'grab', display: 'flex', alignItems: 'center', pr: 1 }}>
            <DragIndicatorIcon />
          </Box>
          <ListItemText primary={chapter.shortTitle} onClick={() => onSelect(chapter)} sx={{ cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}/>
        </Box>
      )}
    </ListItem>
  );
}

export default ChapterListItem;