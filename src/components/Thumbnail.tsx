import type { ApodPicture } from "../types";
import { getImageUrl, isVideoFile } from "../utils";
import styles from "./Thumbnail.module.css";

interface ThumbnailProps {
  picture: ApodPicture;
  className?: string;
}

export default function Thumbnail({ picture, className = "" }: ThumbnailProps) {
  const imageUrl = getImageUrl(picture);
  const classes = `${styles.thumb} ${className}`;

  if (imageUrl) {
    return (
      <img
        className={classes}
        src={imageUrl}
        alt={picture.title}
        loading="lazy"
      />
    );
  }

  if (isVideoFile(picture.url)) {
    return (
      <video
        className={classes}
        src={`${picture.url}#t=0.1`}
        muted
        preload="metadata"
        aria-label={picture.title}
      />
    );
  }

  return (
    <div
      className={`${classes} ${styles.placeholder}`}
      role="img"
      aria-label={picture.title}
    >
      ▶
    </div>
  );
}
