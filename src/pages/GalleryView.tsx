import { Link } from 'react-router';
import type { ApodPicture } from '../types';
import styles from './GalleryView.module.css';
import { useState } from 'react';
import { getImageUrl, formatMonth } from '../utils';

interface GalleryViewProps {
  pictures: ApodPicture[];
}

export default function GalleryView({ pictures }: GalleryViewProps) {
  const withImages = pictures.filter((picture) => getImageUrl(picture) !== undefined);
    const [selectedMonths, setSelectedMonths] = useState<string[]>([]);

  const months = [...new Set(withImages.map((picture) => picture.date.slice(0, 7)))].sort();

  function toggleMonth(month: string) {
    if (selectedMonths.includes(month)) {
      setSelectedMonths(selectedMonths.filter((m) => m !== month));
    } else {
      setSelectedMonths([...selectedMonths, month]);
    }
  }

    const visible = selectedMonths.length === 0 ? withImages: withImages.filter((picture) => selectedMonths.includes(picture.date.slice(0, 7)));

    return (
    <>
      <div className={styles.filters}>
        {months.map((month) => (
          <button
            key={month}
            className={selectedMonths.includes(month) ? styles.active : styles.filterButton}
            aria-pressed={selectedMonths.includes(month)}
            onClick={() => toggleMonth(month)}
          >
            {formatMonth(month)}
          </button>
        ))}
        {selectedMonths.length > 0 && (
          <button className={styles.filterButton} onClick={() => setSelectedMonths([])}>
            Show all
          </button>
        )}
      </div>

      <div className={styles.grid}>
        {visible.map((picture) => (
          <Link key={picture.date} to={`/apod/${picture.date}`}>
            <img className={styles.image} src={getImageUrl(picture)} alt={picture.title} />
          </Link>
        ))}
      </div>
    </>
  );
}