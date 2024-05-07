import React, { useState, useEffect } from 'react';
import './App.css';

const useImageURL = () => {
  const [imageURLs, setImageURLs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const responses = await Promise.all([
          fetch("https://jsonplaceholder.typicode.com/photos/1", { mode: "cors" }),
          fetch("https://jsonplaceholder.typicode.com/photos/2", { mode: "cors" })
        ]);

        const data = await Promise.all(responses.map(response => {
          if (!response.ok) {
            throw new Error("Error fetching image!!");
          }
          return response.json();
        }));

        const imageURLs = data.map(imageData => imageData.url);
        setImageURLs(imageURLs);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return { imageURLs, error, loading };
};

function App() {
  const { imageURLs, error, loading } = useImageURL();

  if (loading) return <p>Page loading, please wait!!</p>;
  if (error) return <p>A network error was encountered!!</p>;

  return (
    <div>
      {imageURLs.map((imageURL, index) => (
        <div key={index}>
          <h1>An image</h1>
          <img src={imageURL} alt={`placeholder text ${index}`} />
        </div>
      ))}
    </div>
  );
}

export default App;
