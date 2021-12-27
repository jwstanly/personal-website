import { CSSProperties } from 'react';
import getImageUrl from '../../lib/getImageUrl';

interface ImageRendererProps {
  src: string;
  alt: string;
  node: any;
}

export default function ImageRenderer(props: ImageRendererProps) {
  const hasCaption = props.alt.toLowerCase() !== 'image';

  const style: CSSProperties = {
    display: 'block',
    maxWidth: '100%',
    objectFit: 'cover',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '40px',
    marginBottom: '40px',
  };

  const src = getImageUrl(props.src);

  return hasCaption ? (
    <figure className="wp-block-image size-large is-resized">
      <img
        data-loading="lazy"
        data-orig-file={src}
        data-medium-file={src + '?w=300'}
        data-large-file={src + '?w=750'}
        src={src}
        alt={props.alt}
        srcSet={
          src +
          '?w=1024 1024w, ' +
          src +
          '?w=705 705w, ' +
          src +
          '?w=150 150w, ' +
          src +
          '?w=300 300w, ' +
          src +
          '?w=768 768w, ' +
          src +
          '?1248w'
        }
        sizes="(max-width: 707px) 100vw, 707px"
        style={style}
      />
      <figcaption style={{ textAlign: 'center' }}>{props.alt}</figcaption>
    </figure>
  ) : (
    <img style={style} src={src} alt={props.alt} />
  );
}
