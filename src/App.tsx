import React, { useState, useEffect } from 'react';
import './App.css';

// Hook personalizado para manejar la lógica de obtención de URL de imágenes
const useImageURL = () => {
  // Estados para almacenar las URL de las imágenes, errores y estado de carga
  const [imageURLs, setImageURLs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Efecto para realizar las solicitudes de imagen al montar el componente
  useEffect(() => {
    // Función asincrónica para realizar las solicitudes
    const fetchImages = async () => {
      try {
        // Realizar solicitudes en paralelo a las URL de las imágenes
        const responses = await Promise.all([
          fetch("https://jsonplaceholder.typicode.com/photos/1", { mode: "cors" }),
          fetch("https://jsonplaceholder.typicode.com/photos/2", { mode: "cors" })
        ]);

        // Convertir las respuestas a JSON
        const data = await Promise.all(responses.map(response => {
          if (!response.ok) {
            throw new Error("Error fetching image!!");
          }
          return response.json();
        }));

        // Extraer las URL de las imágenes de los datos y actualizar el estado
        const imageURLs = data.map(imageData => imageData.url);
        setImageURLs(imageURLs);
      } catch (error) {
        // Capturar cualquier error y establecerlo en el estado
        setError(error);
      } finally {
        // Establecer el estado de carga como falso una vez que se completa la solicitud
        setLoading(false);
      }
    };

    // Llamar a la función para realizar las solicitudes de imagen
    fetchImages();
  }, []); // Se pasa un arreglo vacío para que el efecto se ejecute solo una vez al montar el componente

  // Devolver los estados y funciones relevantes para su uso en el componente
  return { imageURLs, error, loading };
};

// Componente principal de la aplicación
function App() {
  // Utilizar el hook personalizado para obtener las URL de las imágenes y su estado
  const { imageURLs, error, loading } = useImageURL();

  // Renderizar un mensaje de carga mientras se obtienen las imágenes
  if (loading) return <p>Page loading, please wait!!</p>;
  // Renderizar un mensaje de error si ocurre algún problema de red
  if (error) return <p>A network error was encountered!!</p>;

  // Renderizar las imágenes si la carga es exitosa y no hay errores
  return (
    <div>
      {imageURLs.map((imageURL, index) => (
        <div key={index}>
          <h1>An image</h1>
          {/* Mostrar la imagen con su URL y un texto alternativo */}
          <img src={imageURL} alt={`placeholder text ${index}`} />
        </div>
      ))}
    </div>
  );
}

export default App;
