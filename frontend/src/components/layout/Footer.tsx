import { Heart } from 'lucide-react';

/**
 * Application footer
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 mt-auto border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/40">
          <p className="flex items-center gap-1.5">
            Hecho con{' '}
            <Heart
              className="w-4 h-4 text-red-500 fill-red-500"
              aria-label="amor"
            />{' '}
            para fans del fantasy
          </p>
          <p>Quini Fantasy {currentYear}</p>
        </div>
      </div>
    </footer>
  );
}
