import React, { useState, useEffect } from 'react';
import { Box, CssBaseline } from '@mui/material';

import { auth, db } from './firebase.js';
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

// Adicionamos a extensão .jsx em todas as importações de componentes
import Sidebar from './components/Sidebar.jsx';
import Editor from './components/Editor.jsx';
import TopBar from './components/TopBar.jsx';
import LoginScreen from './components/LoginScreen.jsx';
// O caminho './' significa "na mesma pasta que eu (App.jsx)", ou seja, 'src/'
import { handleGoogleLogin, handleLogout, handleAddNewChapter, handleContentChange, handleDeleteChapter, handleRenameChapter, handleReorderChapters } from './firebase-handlers.js';

function App() {
  const [user, setUser] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setChapters([]);
      setSelectedChapter(null);
      return;
    }
    const q = query(collection(db, "chapters"), orderBy("order"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const chaptersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChapters(chaptersData);
    });
    return () => unsubscribe();
  }, [user]);
  
  const handleChapterSelect = (chapter) => {
    setSelectedChapter(chapter);
  };

  const crudHandlers = {
    onContentChange: (content, chapterId) => handleContentChange(content, chapterId),
    onDeleteChapter: (chapterId) => handleDeleteChapter(chapterId, selectedChapter, setSelectedChapter),
    onRenameChapter: (chapterId, newTitles) => handleRenameChapter(chapterId, newTitles),
    onReorderChapters: (activeId, overId) => handleReorderChapters(chapters, setChapters, activeId, overId),
    onNewChapter: () => handleAddNewChapter(chapters),
  };

  if (!user) {
    return <LoginScreen onLogin={handleGoogleLogin} />;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <TopBar user={user} onLogout={handleLogout} />
      <Sidebar
        chapters={chapters}
        onChapterSelect={handleChapterSelect}
        {...crudHandlers}
      />
      <Editor 
        key={selectedChapter?.id}
        chapter={selectedChapter}
        onContentChange={crudHandlers.onContentChange}
      />
    </Box>
  );
}

export default App;