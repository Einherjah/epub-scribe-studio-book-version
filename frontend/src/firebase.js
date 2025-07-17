// Importa as funções que vamos precisar dos pacotes do Firebase
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// Suas credenciais do Firebase que você copiou do console
// COLE SEU OBJETO AQUI
const firebaseConfig = {
  apiKey: "AIzaSyBGkxfNflCR9MK0e-VIEMMlxSOra9sRDvw",
  authDomain: "epub-scribe-studio-bookversion.firebaseapp.com",
  projectId: "epub-scribe-studio-bookversion",
  storageBucket: "epub-scribe-studio-bookversion.firebasestorage.app",
  messagingSenderId: "319836057050",
  appId: "1:319836057050:web:0a57a1066fafa9d4efa4e3"
};

// Inicia a aplicação Firebase
const app = initializeApp(firebaseConfig);

// Inicia os serviços que vamos usar
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Código "inteligente": se estivermos em modo de desenvolvimento,
// ele aponta para os emuladores locais em vez de ir para a nuvem.
if (import.meta.env.DEV) {
  console.log("Modo de desenvolvimento. Conectando aos Emuladores do Firebase...");

  // Conecta ao emulador de Autenticação
  connectAuthEmulator(auth, "http://127.0.0.1:9099");

  // Conecta ao emulador do Firestore
  connectFirestoreEmulator(db, '127.0.0.1', 8081);

  // Conecta ao emulador do Storage
  connectStorageEmulator(storage, '127.0.0.1', 9199);
}

// Exporta os serviços para que possamos usá-los em outras partes da nossa aplicação
export { auth, db, storage };