import { Link } from "react-router";
import type { ApodPicture, DetailNavState } from "../types";
import styles from "./GalleryView.module.css";
import { useState } from "react";
import { formatMonth } from "../utils";
import Thumbnail from "../components/Thumbnail";

interface GalleryViewProps {
  pictures: ApodPicture[];
}

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value): [...list, value];
}

export default function GalleryView({ pictures }: GalleryViewProps) {
  const months = [...new Set(pictures.map((picture) => picture.date.slice(0, 7))), ].sort();

  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<("image" | "video")[]>([]);

  const visible = pictures.filter((picture) => {
    const monthMatches = selectedMonths.length === 0 || selectedMonths.includes(picture.date.slice(0, 7));
    const typeMatches = selectedTypes.length === 0 || selectedTypes.includes(picture.media_type);
    return monthMatches && typeMatches;
  });

  const navState: DetailNavState = {
    dates: visible.map((picture) => picture.date),
  };

  const hasFilters = selectedMonths.length > 0 || selectedTypes.length > 0;

  return (
    <>
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <span className={styles.groupLabel}>Type</span>
          {(["image", "video"] as const).map((type) => (
            <button
              key={type}
              className={selectedTypes.includes(type) ? styles.active: styles.filterButton
              }
              aria-pressed={selectedTypes.includes(type)}
              onClick={() => setSelectedTypes(toggle(selectedTypes, type))}
            >
              {type === "image" ? "Images" : "Videos"}
            </button>
          ))}
        </div>

        <div className={styles.filterGroup}>
          <span className={styles.groupLabel}>Month</span>
          {months.map((month) => (
            <button
              key={month}
              className={
                selectedMonths.includes(month) ? styles.active: styles.filterButton
              }
              aria-pressed={selectedMonths.includes(month)}
              onClick={() => setSelectedMonths(toggle(selectedMonths, month))}
            >
              {formatMonth(month)}
            </button>
          ))}
        </div>

        {hasFilters && (
          <button
            className={styles.clearButton}
            onClick={() => {
              setSelectedMonths([]);
              setSelectedTypes([]);
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      {visible.length === 0 && (
        <p className={styles.empty}>No pictures match these filters.</p>
      )}

      <div className={styles.grid}>
        {visible.map((picture) => (
          <Link
            key={picture.date}
            to={`/apod/${picture.date}`}
            state={navState}
          >
            <Thumbnail picture={picture} className={styles.image} />
          </Link>
        ))}
      </div>
    </>
  );
}
