import 'dotenv/config';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

function getEnv(name) {
  // Prefer import.meta.env cuando exista (Vite), si no use process.env (Node)
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[name]) {
    return import.meta.env[name];
  }
  return process.env[name];
}

const firebaseConfig = {
    apiKey: getEnv('VITE_FIREBASE_API_KEY'),
    authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN'),
    databaseURL: getEnv('VITE_FIREBASE_DATABASE_URL'),
    projectId: getEnv('VITE_FIREBASE_PROJECT_ID'),
    storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    appId: getEnv('VITE_FIREBASE_APP_ID')
};

// 1. Inicializa la app de Firebase
const app = initializeApp(firebaseConfig);
// 2. Obtiene la instancia de Firestore
const db = getFirestore(app);

// 3. Define la función para "espiar" el documento
async function checkDocumentData() {
  // Crea la referencia al documento que quieres leer
  const docRef = doc(db, "investmentEvolutions", "user1");

  console.log("Conectando a Firestore y buscando el documento...");

  try {
    // getDoc() pide el documento UNA SOLA VEZ (no se queda "escuchando")
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("¡Documento encontrado! Los datos son:");
      // Imprime los datos completos en la consola
      console.log(JSON.stringify(docSnap.data(), null, 2));
    } else {
      console.log("Error: No se encontró el documento en la ruta 'investmentEvolutions/user1'");
    }
  } catch (error) {
    console.error("Error al conectarse o leer el documento:", error);
  }
}

// 4. Llama a la función
checkDocumentData();