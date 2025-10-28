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

// 1. Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 2. Función para encontrar arrays
async function findArrayFields() {
  const docRef = doc(db, "investmentEvolutions", "user1");
  console.log("Conectando y buscando el documento 'user1'...");

  try {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data(); // Obtenemos el objeto del documento
      
      console.log("¡Documento encontrado! Analizando campos...");
      let found = false;

      // Iteramos sobre CADA CAMPO (key) en el documento
      for (const key in data) {
        
        // Verificamos si el valor de ese campo ES un array
        if (Array.isArray(data[key])) {
          console.log("-----------------------------------------");
          console.log(`¡ARRAY ENCONTRADO! 🥳`);
          console.log(`El nombre del campo es: "${key}"`);
          console.log(`Este array tiene ${data[key].length} elementos.`);
          console.log("-----------------------------------------");
          found = true;
        }
      }

      if (!found) {
        console.log("Análisis terminado: No se encontró ningún array en la raíz de este documento.");
      }
      
    } else {
      console.log("Error: No se encontró el documento en la ruta 'investmentEvolutions/user1'");
    }
  } catch (error) {
    console.error("Error al leer el documento:", error);
  }
}

// 3. Llama a la función
findArrayFields();