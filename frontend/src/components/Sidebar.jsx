import React from 'react';
import { Drawer, List, Divider, Box, Toolbar, Typography, IconButton } from '@mui/material';
import ChapterListItem from './ChapterListItem.jsx';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

const drawerWidth = 240;

function Sidebar({ chapters, onChapterSelect, onNewChapter, onDeleteChapter, onRenameChapter, onReorderChapters }) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  function handleDragEnd(event) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      onReorderChapters(active.id, over.id);
    }
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, flexShrink: 0 }}>
        <Typography variant="h6" component="div">Capítulos</Typography>
        <IconButton onClick={onNewChapter} color="primary"><AddCircleOutlineIcon /></IconButton>
      </Box>
      <Divider />
      <Box sx={{ overflowY: 'auto' }}>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={chapters.map(c => c.id)} strategy={verticalListSortingStrategy}>
            <List>
              {chapters.map((chapter) => (
                <ChapterListItem
                  key={chapter.id}
                  chapter={chapter}
                  onSelect={onChapterSelect}
                  onDelete={onDeleteChapter}
                  onRename={onRenameChapter}
                />
              ))}
            </List>
          </SortableContext>
        </DndContext>
      </Box>
    </Drawer>
  );
}

export default Sidebar;