// CÓDIGO COMPLETO PARA firebase-handlers.js
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { collection, addDoc, doc, updateDoc, deleteDoc, writeBatch } from "firebase/firestore";
import { auth, db } from './firebase.js';

let debounceTimer = null;

export const handleGoogleLogin = async () => {
  const provider = new GoogleAuthProvider();
  try { await signInWithPopup(auth, provider); } catch (error) { console.error("Erro no login:", error); }
};

export const handleLogout = async () => {
  try { await signOut(auth); } catch (error) { console.error("Erro no logout:", error); }
};

export const handleAddNewChapter = async (chapters) => {
  try {
    const collectionRef = collection(db, "chapters");
    await addDoc(collectionRef, {
      shortTitle: `Capítulo ${chapters.length + 1}`,
      longTitle: "Título do Novo Capítulo",
      content: "<p>Comece a escrever aqui...</p>",
      order: chapters.length
    });
  } catch (error) {
    console.error("Erro ao adicionar capítulo:", error);
  }
};

export const handleContentChange = (newContent, chapterId) => {
  if (debounceTimer) { clearTimeout(debounceTimer); }
  debounceTimer = setTimeout(async () => {
    const docRef = doc(db, "chapters", chapterId);
    await updateDoc(docRef, { content: newContent });
    console.log("Conteúdo salvo!");
  }, 1500);
};

export const handleDeleteChapter = async (chapterId, selectedChapter, setSelectedChapter) => {
  if (window.confirm("Você tem certeza que deseja excluir este capítulo?")) {
    try {
      if (selectedChapter?.id === chapterId) { setSelectedChapter(null); }
      const docRef = doc(db, "chapters", chapterId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Erro ao excluir capítulo:", error);
    }
  }
};

export const handleRenameChapter = async (chapterId, newTitles) => {
  try {
    const docRef = doc(db, "chapters", chapterId);
    await updateDoc(docRef, { shortTitle: newTitles.shortTitle, longTitle: newTitles.longTitle });
  } catch (error) {
    console.error("Erro ao renomear capítulo:", error);
  }
};

export const handleReorderChapters = async (chapters, setChapters, activeId, overId) => {
  const oldIndex = chapters.findIndex(c => c.id === activeId);
  const newIndex = chapters.findIndex(c => c.id === overId);
  if (oldIndex === -1 || newIndex === -1) return;
  const reorderedChapters = [...chapters];
  const [movedItem] = reorderedChapters.splice(oldIndex, 1);
  reorderedChapters.splice(newIndex, 0, movedItem);
  setChapters(reorderedChapters);
  try {
    const batch = writeBatch(db);
    reorderedChapters.forEach((chapter, index) => {
      const docRef = doc(db, "chapters", chapter.id);
      batch.update(docRef, { order: index });
    });
    await batch.commit();
  } catch (error) {
    console.error("Erro ao reordenar capítulos:", error);
    setChapters(chapters);
  }
};