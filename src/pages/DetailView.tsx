import { Link, useParams } from 'react-router';
import type { ApodPicture } from '../types';
import { getImageUrl } from '../utils';
import styles from './DetailView.module.css';

interface DetailViewProps {
  pictures: ApodPicture[];
  loading: boolean;
}

export default function DetailView({ pictures, loading }: DetailViewProps) {
  const { date } = useParams();

  if (loading) return null;

  const index = pictures.findIndex((picture) => picture.date === date);

  if (index === -1) {
    return (
      <p>
        No picture found for {date}. <Link to="/">Back to the list</Link>
      </p>
    );
  }

  const picture = pictures[index];
  const prev = pictures[(index - 1 + pictures.length) % pictures.length];
  const next = pictures[(index + 1) % pictures.length];
  const imageUrl = getImageUrl(picture);

    return (
    <article className={styles.detail}>
      <nav className={styles.pager}>
        <Link to={`/apod/${prev.date}`}>← Previous</Link>
        <Link to={`/apod/${next.date}`}>Next →</Link>
      </nav>

      <h1>{picture.title}</h1>
      <p className={styles.meta}>
        {picture.date}
        {picture.copyright && ` · © ${picture.copyright}`}
      </p>

      {imageUrl && <img className={styles.image} src={imageUrl} alt={picture.title} />}

      {picture.media_type === 'video' && (
        <p>
          <a href={picture.url} target="_blank" rel="noreferrer">
            Watch the video
          </a>
        </p>
      )}

      <p className={styles.explanation}>{picture.explanation}</p>
    </article>
  );
}