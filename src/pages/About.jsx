import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, Star, Award, Truck, ChefHat, Heart } from 'lucide-react';

export default function About() {
  return (
    <main className="pt-20 min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-10">
          <span className="inline-flex items-center rounded-md border border-transparent shadow mb-3 bg-[#FFB81C] text-[#1A1A1A] px-4 py-2 text-sm font-black">
            🍗 À PROPOS
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-3">
            R-<span className="text-[#E4002B]">CHICKEN</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Le meilleur poulet frit de Bamako, depuis des années au service de la qualité
          </p>
        </div>

        {/* Hero Image */}
        <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-10">
          <img
            src="https://i.postimg.cc/ZqqPkfws/Gemini-Generated-Image-v9q21uv9q21uv9q2.png"
            alt="R-CHICKEN Restaurant"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-6 left-6">
            <h2 className="text-white text-2xl md:text-4xl font-black">
              Qualité & Tradition
            </h2>
          </div>
        </div>

        {/* Our Story */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">
            📖 Notre Histoire
          </h2>
          <div className="space-y-4 text-gray-600">
            <p>
              <strong className="text-[#E4002B]">R-CHICKEN</strong> est né d'une passion pour la cuisine et d'un désir de partager les meilleures saveurs du poulet frit avec Bamako et ses environs.
            </p>
            <p>
              Depuis notre ouverture à <strong>Baco-djicoroni Golf</strong>, nous nous engageons à offrir à nos clients un poulet frit de qualité supérieure, préparé avec des ingrédients frais et des recettes authentique.
            </p>
            <p>
              Aujourd'hui, R-CHICKEN est devenu une référence incontournable de la restauration rapide à Bamako, réputée pour la qualité de ses produits et la rapidité de son service.
            </p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChefHat className="w-8 h-8 text-[#E4002B]" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">Poulet Frais</h3>
            <p className="text-gray-600 text-sm">Nous utilisons uniquement du poulet frais de qualité pour garantir un goût exceptionnel</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">Recette Unique</h3>
            <p className="text-gray-600 text-sm">Une recette secrète développée pour un croustillant inégalé</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">Livraison Rapide</h3>
            <p className="text-gray-600 text-sm">Recevez votre commande en 30-45 minutes directement chez vous</p>
          </div>
        </div>

        {/* Values */}
        <div className="bg-gradient-to-r from-[#E4002B] to-[#C4001F] rounded-2xl p-6 md:p-8 text-white mb-8">
          <h2 className="text-2xl md:text-3xl font-black mb-6 text-center">Nos Valeurs</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <Star className="w-10 h-10 mx-auto mb-3 text-[#FFB81C]" />
              <h3 className="font-bold">Qualité</h3>
              <p className="text-sm text-white/80">Produits frais</p>
            </div>
            <div className="text-center">
              <Clock className="w-10 h-10 mx-auto mb-3 text-[#FFB81C]" />
              <h3 className="font-bold">Rapidité</h3>
              <p className="text-sm text-white/80">Service efficace</p>
            </div>
            <div className="text-center">
              <Heart className="w-10 h-10 mx-auto mb-3 text-[#FFB81C]" />
              <h3 className="font-bold">Passion</h3>
              <p className="text-sm text-white/80">Amour du métier</p>
            </div>
            <div className="text-center">
              <Award className="w-10 h-10 mx-auto mb-3 text-[#FFB81C]" />
              <h3 className="font-bold">Excellence</h3>
              <p className="text-sm text-white/80">Toujours meilleur</p>
            </div>
          </div>
        </div>

        {/* Location & Contact */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-6">
            📍 Nous Trouver
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-[#E4002B]" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Adresse</p>
                  <p className="text-gray-600">Baco-djicoroni Golf, HXGV+5X7</p>
                  <p className="text-gray-600">Bamako, Mali 🇲🇱</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-[#E4002B]" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Téléphone</p>
                  <a href="tel:+22383806129" className="text-[#E4002B] hover:underline">
                    +223 83 80 61 29
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-[#E4002B]" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Horaires</p>
                  <p className="text-gray-600">24h/24 - 7j/7</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.5!2d-8.002!3d12.639!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDM4JzE4LjIiTiA4wrAwMCcwMS40Ilc!5e0!3m2!1sfr!2sml!4v1"
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                className="rounded-lg"
                title="Carte R-CHICKEN Bamako"
              ></iframe>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">
            Prêt à commander ?
          </h2>
          <p className="text-gray-600 mb-6">
            Dégustez le meilleur poulet frit de Bamako !
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/menu">
              <button className="kfc-button text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:scale-105 transition-transform">
                Voir le Menu
              </button>
            </Link>
            <Link to="/contact">
              <button className="bg-white border-2 border-[#E4002B] text-[#E4002B] hover:bg-[#E4002B] hover:text-white font-bold px-8 py-4 rounded-xl transition-colors">
                Nous Contacter
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}