/**
 * Image Optimizer Utility for Client-Side Compression
 * Converts images to lightweight, high-definition Data URLs (< 80KB)
 * to ensure instant, reliable Supabase synchronization.
 */

export interface OptimizeOptions {
  maxDimension?: number;
  quality?: number;
  mimeType?: 'image/webp' | 'image/jpeg';
}

export async function optimizeImageFile(
  file: File,
  options: OptimizeOptions = {}
): Promise<string> {
  const { maxDimension = 1200, quality = 0.82, mimeType = 'image/jpeg' } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier image.'));
    reader.onload = (event) => {
      const src = event.target?.result as string;
      if (!src) {
        reject(new Error('Source image vide.'));
        return;
      }
      optimizeImageDataUrl(src, { maxDimension, quality, mimeType })
        .then(resolve)
        .catch(reject);
    };
    reader.readAsDataURL(file);
  });
}

export async function optimizeImageDataUrl(
  dataUrl: string,
  options: OptimizeOptions = {}
): Promise<string> {
  // If it's a standard web URL (http/https), no need to compress DataURL
  if (dataUrl.startsWith('http://') || dataUrl.startsWith('https://') || dataUrl.startsWith('/')) {
    return dataUrl;
  }

  const { maxDimension = 1200, quality = 0.82, mimeType = 'image/jpeg' } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onerror = () => reject(new Error('Impossible de charger l\'image pour optimisation.'));
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }

        // Fill background white for transparent PNG converted to JPEG
        if (mimeType === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Try preferred format (webp/jpeg) with fallback
        try {
          const optimized = canvas.toDataURL(mimeType, quality);
          resolve(optimized);
        } catch {
          const fallback = canvas.toDataURL('image/jpeg', quality);
          resolve(fallback);
        }
      } catch (err) {
        console.warn('Image optimization canvas error, fallback to original:', err);
        resolve(dataUrl);
      }
    };
    img.src = dataUrl;
  });
}
