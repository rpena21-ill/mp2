import { useState } from "react";
import { Link } from "react-router";
import styles from "./ListView.module.css";
import type { ApodPicture, DetailNavState } from "../types";
import Thumbnail from "../components/Thumbnail";

interface ListViewProps {
  pictures: ApodPicture[];
}

export default function ListView({ pictures }: ListViewProps) {
  const [query, setQuery] = useState("");
  const [sortField, setSortField] = useState<"title" | "date">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [typeFilter, setTypeFilter] = useState<"all" | "image" | "video">("all", );

  const filtered = pictures.filter((picture) => {
    const matchesSearch = picture.title.toLowerCase().includes(query.toLowerCase());
    const matchesType = typeFilter === "all" || picture.media_type === typeFilter;
    return matchesSearch && matchesType;
  });
  const sorted = [...filtered].sort((a, b) => {
    const result = a[sortField].localeCompare(b[sortField]);
    return sortOrder === "asc" ? result : -result;
  });

  const navState: DetailNavState = {
    dates: sorted.map((picture) => picture.date),
  };

  return (
    <>
      <div className={styles.controls}>
        <label className={`${styles.control} ${styles.search}`}>
          Search
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. galaxy"
          />
        </label>

        <label className={styles.control}>
          Type
          <select
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value as "all" | "image" | "video")
            }
          >
            <option value="all">All</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
          </select>
        </label>

        <label className={styles.control}>
          Sort by
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as "title" | "date")}
          >
            <option value="title">Title</option>
            <option value="date">Date</option>
          </select>
        </label>

        <label className={styles.control}>
          Order
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
      </div>

      {sorted.length === 0 && (
        <p className={styles.empty}>
          No pictures match your search and filters.
        </p>
      )}

      <ul className={styles.list}>
        {sorted.map((picture) => (
          <li key={picture.date}>
            <Link
              to={`/apod/${picture.date}`}
              state={navState}
              className={styles.row}
            >
              <Thumbnail picture={picture} className={styles.thumb} />
              <span className={styles.titleCell}>
                <span className={styles.title}>{picture.title}</span>
                {picture.media_type === "video" && (
                  <span className={styles.badge}>Video</span>
                )}
              </span>
              <span className={styles.date}>{picture.date}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
