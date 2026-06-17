import Image from "next/image";

interface CdnImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

/** Optimized remote image (ESPN CDN, etc.) via next/image. */
export function CdnImage({
  src,
  alt,
  width,
  height,
  className,
  priority,
  sizes,
}: CdnImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      sizes={sizes ?? `${width}px`}
      quality={75}
    />
  );
}

interface CdnFillImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes: string;
  priority?: boolean;
}

/** Fill-mode optimized image for card thumbnails. Parent must be `position: relative`. */
export function CdnFillImage({ src, alt, className, sizes, priority }: CdnFillImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={className}
      sizes={sizes}
      quality={75}
      priority={priority}
    />
  );
}
