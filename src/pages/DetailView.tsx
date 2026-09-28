import { Link, useParams, useLocation } from 'react-router';
import type { ApodPicture, DetailNavState } from '../types';
import styles from './DetailView.module.css';
import { isVideoFile } from '../utils';

interface DetailViewProps {
  pictures: ApodPicture[];
  loading: boolean;
}

export default function DetailView({ pictures, loading }: DetailViewProps) {
    const { date } = useParams();
  const location = useLocation();

  if (loading) return null;

  const picture = pictures.find((p) => p.date === date);

  if (!picture) {
    return (
      <p>
        No picture found for {date}. <Link to="/">Back to the list</Link>
      </p>
    );
  }

  const navState = location.state as DetailNavState | null;
  const sequence =
    navState?.dates && navState.dates.includes(picture.date)
      ? navState.dates
      : pictures.map((p) => p.date);

  const position = sequence.indexOf(picture.date);
  const prevDate = sequence[(position - 1 + sequence.length) % sequence.length];
  const nextDate = sequence[(position + 1) % sequence.length];
  const nextState: DetailNavState = { dates: sequence };

    let media;
    if (picture.media_type === 'image') {
        media = <img className={styles.media} src={picture.url} alt={picture.title} />;
    } else if (isVideoFile(picture.url)) {
        media = <video className={styles.media} src={picture.url} controls />;
    } else {
        media = (
        <iframe
            className={styles.media}
            src={picture.url}
            title={picture.title}
            allow="fullscreen; picture-in-picture"
            allowFullScreen
        />
        );
    }

    return (
    <article className={styles.detail}>
        <nav className={styles.pager}>
        <Link to={`/apod/${prevDate}`} state={nextState}>← Previous</Link>
        <span className={styles.meta}>
          {position + 1} of {sequence.length}
        </span>
        <Link to={`/apod/${nextDate}`} state={nextState}>Next →</Link>
      </nav>

      <h1>{picture.title}</h1>
      <p className={styles.meta}>
        {picture.date}
        {picture.copyright && ` · © ${picture.copyright}`}
      </p>

      {media}

{picture.media_type === 'video' && (
  <p className={styles.meta}>
    Video not playing?{' '}
    <a href={picture.url} target="_blank" rel="noreferrer">
      Open it in a new tab
    </a>
  </p>
)}

      <p className={styles.explanation}>{picture.explanation}</p>
    </article>
  );
}