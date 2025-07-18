import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { auth, db } from './firebase.js';

import Sidebar from './components/Sidebar.jsx';
import Editor from './components/Editor.jsx';
import TopBar from './components/TopBar.jsx';
import LoginScreen from './components/LoginScreen.jsx';
import { handleGoogleLogin, handleLogout, handleAddNewChapter, handleDeleteChapter, handleRenameChapter, handleReorderChapters } from './firebase-handlers.js';

function App() {
  const [user, setUser] = React.useState(null);
  const [chapters, setChapters] = React.useState([]);
  const [selectedChapter, setSelectedChapter] = React.useState(null);
  const debounceTimerRef = React.useRef(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    if (!user) {
      setChapters([]);
      setSelectedChapter(null);
      return;
    }
    const q = query(collection(db, "chapters"), orderBy("order"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const chaptersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChapters(chaptersData);
      
      const currentSelectedId = selectedChapter ? selectedChapter.id : null;
      const stillExists = chaptersData.some(c => c.id === currentSelectedId);

      if (!stillExists && chaptersData.length > 0) {
        setSelectedChapter(chaptersData[0]);
      } else if (stillExists) {
        // Atualiza o capítulo selecionado com os novos dados do snapshot
        setSelectedChapter(chaptersData.find(c => c.id === currentSelectedId));
      } else {
        setSelectedChapter(null);
      }
    });
    return () => unsubscribe();
  }, [user]);
  
  const handleContentChange = (newContent, chapterId) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(async () => {
      if (chapterId) {
        const docRef = doc(db, "chapters", chapterId);
        await updateDoc(docRef, { content: newContent });
        console.log("Conteúdo salvo!");
      }
    }, 1500);
  };

  const handleChapterSelect = (chapter) => {
    setSelectedChapter(chapter);
  };

  const crudHandlers = {
    onContentChange: handleContentChange,
    onDeleteChapter: (chapterId) => handleDeleteChapter(chapterId, selectedChapter, setSelectedChapter),
    onRenameChapter: (chapterId, newTitles) => handleRenameChapter(chapterId, newTitles),
    onReorderChapters: (activeId, overId) => handleReorderChapters(chapters, setChapters, activeId, overId),
    onNewChapter: () => handleAddNewChapter(chapters),
  };

  if (!user) {
    return <LoginScreen onLogin={handleGoogleLogin} />;
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
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