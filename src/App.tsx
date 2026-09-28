import { Routes, Route, Link, NavLink } from "react-router";
import styles from "./App.module.css";
import DetailView from "./pages/DetailView.tsx";
import GalleryView from "./pages/GalleryView.tsx";
import ListView from "./pages/ListView.tsx";
import { useState, useEffect } from "react";
import { fetchPictures } from "./api/apod.ts";
import type { ApodPicture } from "./types.ts";

function App() {
  const [pictures, setPictures] = useState<ApodPicture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const start = new Date();
    start.setDate(1);
    start.setMonth(start.getMonth() - 5);
    const startDate = start.toISOString().slice(0, 10);

    fetchPictures(startDate)
      .then((data) => setPictures(data))
      .catch(() =>
        setError("Could not load pictures from NASA. Please try again later."),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>
          Astronomy Picture of the Day
        </Link>
        <nav>
          <ul className={styles.nav}>
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  isActive ? styles.activeLink : styles.link
                }
              >
                List
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/gallery"
                className={({ isActive }) =>
                  isActive ? styles.activeLink : styles.link
                }
              >
                Gallery
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>

      <main className={styles.main}>
        {loading && <p className={styles.status}>Loading...</p>}
        {error && <p className={styles.error}>{error}</p>}

        <Routes>
          <Route path="/" element={<ListView pictures={pictures} />} />
          <Route
            path="/gallery"
            element={<GalleryView pictures={pictures} />}
          />
          <Route
            path="/apod/:date"
            element={<DetailView pictures={pictures} loading={loading} />}
          />
        </Routes>
      </main>
    </>
  );
}

export default App;
