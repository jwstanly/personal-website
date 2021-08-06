import { CSSProperties } from 'react';

interface ImageRendererProps {
  src: string;
  alt: string;
  node: any;
}

export default function ImageRenderer(props) {
  console.log('props', props);

  const hasCaption = props.alt !== 'image';

  const style: CSSProperties = {
    display: 'block',
    maxWidth: '100%',
    objectFit: 'cover',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '40px',
    marginBottom: '40px',
  };

  return hasCaption ? (
    <figure className="wp-block-image size-large is-resized">
      <img
        data-loading="lazy"
        data-orig-file={props.src}
        data-medium-file={props.src + '?w=300'}
        data-large-file={props.src + '?w=750'}
        src={props.src}
        alt={props.alt}
        srcSet={
          props.src +
          '?w=1024 1024w, ' +
          props.src +
          '?w=705 705w, ' +
          props.src +
          '?w=150 150w, ' +
          props.src +
          '?w=300 300w, ' +
          props.src +
          '?w=768 768w, ' +
          props.src +
          '?1248w'
        }
        sizes="(max-width: 707px) 100vw, 707px"
        style={style}
      />
      <figcaption style={{ textAlign: 'center' }}>{props.alt}</figcaption>
    </figure>
  ) : (
    <img style={style} src={props.src} alt={props.alt} />
  );
}
