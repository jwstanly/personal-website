export default function ImageRenderer(props) {
  const imageSrc = props.src;
  const altText = props.alt;
  return (
    <figure className="wp-block-image size-large is-resized">
      <img
        data-loading="lazy"
        data-orig-file={imageSrc}
        data-medium-file={imageSrc + '?w=300'}
        data-large-file={imageSrc + '?w=750'}
        src={imageSrc}
        alt={altText}
        srcSet={
          imageSrc +
          '?w=1024 1024w, ' +
          imageSrc +
          '?w=705 705w, ' +
          imageSrc +
          '?w=150 150w, ' +
          imageSrc +
          '?w=300 300w, ' +
          imageSrc +
          '?w=768 768w, ' +
          imageSrc +
          '?1248w'
        }
        sizes="(max-width: 707px) 100vw, 707px"
      />
      <figcaption style={{ textAlign: 'center' }}>{altText}</figcaption>
    </figure>
  );
}
