import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/config'; // Importamos la instancia de DB

/**
 * Hook para escuchar en tiempo real la evolución del portafolio.
 */
export const usePortfolioStream = () => {
  // Estado para los datos procesados
  const [data, setData] = useState(null);
  // Estado de carga
  const [loading, setLoading] = useState(true);
  // Estado de error
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    // Creamos la referencia al documento específico
    const docRef = doc(db, 'investmentEvolutions', 'user1');

    // 'onSnapshot' escucha cambios en tiempo real
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          // Extraemos el arreglo 'array' del documento
          const rawData = snapshot.data().array;
          
          if (rawData && Array.isArray(rawData)) {
            // 1. Procesamos los datos
            const processedData = rawData
              .map(item => ({
                ...item,
                // 2. Convertimos el timestamp de Firestore a un objeto Date de JS
                date: new Date(item.date.seconds * 1000),
              }))
              // 3. Aseguramos el orden cronológico para la gráfica
              .sort((a, b) => a.date - b.date); 
              
            setData(processedData);
            setError(null); // Limpiamos errores previos
          } else {
            setError('El formato de datos es incorrecto. No se encontró el "array".');
          }
        } else {
          setError('No se encontró el documento especificado.');
        }
        setLoading(false); // Terminamos la carga
      },
      (err) => {
        // Manejo de errores de Firestore (permisos, conexión, etc.)
        console.error("Error al escuchar el documento:", err);
        setError('Error al conectar con la base de datos.');
        setLoading(false);
      }
    );

    // Función de limpieza:
    // Se ejecuta cuando el componente que usa el hook se desmonta.
    // Esto previene memory leaks al detener la escucha de Firebase.
    return () => unsubscribe();
    
  }, []); // El array vacío asegura que esto se ejecute solo una vez (al montar)

  // Devolvemos el estado para que el componente lo consuma
  return { data, loading, error };
};