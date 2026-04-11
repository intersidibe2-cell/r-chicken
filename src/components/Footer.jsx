import { Link } from 'react-router-dom';
import { Phone, Info } from 'lucide-react';

export default function Footer() {
  return (
    <>
      <footer className="bg-[#1A1A1A] text-gray-300 py-4 md:py-6 border-t border-[#E4002B] pb-20 md:pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Links */}
          <div className="flex justify-center gap-6 mb-4">
            <Link to="/contact" className="flex items-center gap-2 text-sm hover:text-[#E4002B] transition-colors">
              <Phone className="w-4 h-4" />
              Contact
            </Link>
            <Link to="/about" className="flex items-center gap-2 text-sm hover:text-[#E4002B] transition-colors">
              <Info className="w-4 h-4" />
              À propos
            </Link>
          </div>
          
          <div className="text-center">
            <p className="text-xs md:text-sm text-gray-400">
              © 2026 R-CHICKEN. Tous droits réservés. | Bamako, Mali 🇲🇱
            </p>
            <div className="flex justify-center gap-4 mt-2">
              <a
                href="https://www.tiktok.com/@rouski_chicken"
                className="text-pink-400 hover:underline text-xs md:text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                TikTok @rouski_chicken
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
