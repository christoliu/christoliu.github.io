import React, { useState, useEffect } from 'react';
import { ImageOff, Image as ImageIcon } from 'lucide-react';
import clsx from 'clsx';
import { resolveImageUrl } from '../services/content';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  fallbackText?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ 
  src, 
  alt, 
  className, 
  fallbackText,
  ...props 
}) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  
  // Reset state when src changes
  useEffect(() => {
    setError(false);
    setLoaded(false);
  }, [src]);

  const resolvedSrc = resolveImageUrl(src);

  if (!resolvedSrc || error) {
    return (
      <div className={clsx("flex flex-col items-center justify-center bg-slate-100 text-slate-400", className)}>
        <ImageOff className="w-8 h-8 mb-2 opacity-50" />
        <span className="text-xs font-medium uppercase tracking-wider">{fallbackText || 'Image not found'}</span>
      </div>
    );
  }

  return (
    <div className={clsx("relative overflow-hidden bg-slate-200", className)}>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center text-slate-400">
           <ImageIcon className="w-6 h-6 animate-pulse" />
        </div>
      )}
      <img
        {...props}
        src={resolvedSrc}
        alt={alt}
        className={clsx("w-full h-full object-cover transition-opacity duration-300", loaded ? "opacity-100" : "opacity-0")}
        onLoad={() => setLoaded(true)}
        onError={(e) => {
          console.error(`Failed to load image: ${resolvedSrc}`);
          setError(true);
        }}
      />
    </div>
  );
};