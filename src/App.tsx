import './App.css'

import { Routes, Route, Link } from 'react-router'
import DetailView from './pages/DetailView.tsx'
import GalleryView from './pages/GalleryView.tsx'
import ListView from './pages/ListView.tsx'
import { useState, useEffect } from 'react'
import { fetchPictures } from './api/apod.ts'
import type { ApodPicture } from './types.ts'

function App() {
  const [pictures, setPictures] = useState<ApodPicture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const start = new Date();
    start.setDate(start.getDate() - 60);
    const startDate = start.toISOString().slice(0, 10);

    fetchPictures(startDate)
      .then((data) => setPictures(data))
      .catch(() => setError('Could not load pictures from NASA. Please try again later.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>

      <nav> 
        <ul>
          <li><Link to="/">List</Link></li>
          <li><Link to="/gallery">Gallery</Link></li>
        </ul>
      </nav>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <Routes>
        <Route path="/" element={<ListView pictures={pictures}/>} />
        <Route path="/gallery" element={<GalleryView pictures={pictures} />} />
        <Route path="/apod/:date" element={<DetailView pictures={pictures} loading={loading} />} />
      </Routes>

    </>
  )
}

export default App