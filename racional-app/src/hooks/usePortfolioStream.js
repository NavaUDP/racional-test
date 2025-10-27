import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/config';

// Este es nuestro Hook personalizado
export const usePortfolioStream = (documentId) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!documentId) return;

    // Creamos la referencia al documento específico que nos pediste
    const docRef = doc(db, 'investmentEvolutions', documentId);

    // onSnapshot es la función clave de Firestore para "escuchar"
    // en tiempo real.
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        // Callback que se ejecuta cada vez que el dato cambia
        if (docSnap.exists()) {
          // Si el documento existe, guardamos sus datos
          setData(docSnap.data());
          setIsLoading(false);
        } else {
          // Si el documento no existe
          setError(new Error('El portafolio de este usuario no existe.'));
          setIsLoading(false);
        }
      },
      (err) => {
        // Callback para manejar errores (ej. permisos)
        console.error("Error al escuchar el documento:", err);
        setError(err);
        setIsLoading(false);
      }
    );

    // Función de limpieza de useEffect:
    // Se ejecuta cuando el componente se "desmonta" (deja de usarse)
    // Esto es VITAL para cancelar la suscripción y evitar fugas de memoria.
    return () => {
      unsubscribe();
    };
    
  }, [documentId]); // Solo se vuelve a ejecutar si documentId cambia

  // El hook devuelve el estado para que el componente lo use
  return { data, isLoading, error };
};