import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Clock, Mail, Send, MessageCircle, Check } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const subjectMap = {
      commande: 'Question sur une commande',
      information: "J'ai une question",
      suggestion: 'Suggestion',
      reclamation: 'Problème avec ma commande',
      autre: 'Autre',
    };
    const sujet = subjectMap[formData.subject] || formData.subject || 'Message';
    const text = `Bonjour R-CHICKEN !\n\n*${sujet}*\n\nNom : ${formData.name}\nTéléphone : ${formData.phone}\n\n${formData.message}`;
    window.open(`https://wa.me/22383806129?text=${encodeURIComponent(text)}`, '_blank');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent('Bonjour R-CHICKEN ! Je souhaite commander ou avoir des informations.');
    window.open(`https://wa.me/22383806129?text=${message}`, '_blank');
  };

  return (
    <main className="pt-20 min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-10">
          <span className="inline-flex items-center rounded-md border border-transparent shadow mb-3 bg-[#FFB81C] text-[#1A1A1A] px-4 py-2 text-sm font-black">
            📞 NOUS CONTACTER
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-3">
           Contactez-<span className="text-[#E4002B]">nous</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Une question, une suggestion ou une commande ? N'hésitez pas à nous contacter !
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Contact Info */}
          <div className="space-y-6">
            {/* Quick Contact */}
            <div className="bg-gradient-to-r from-[#E4002B] to-[#C4001F] rounded-2xl p-6 text-white">
              <h2 className="font-black text-xl mb-4">📱 Contact Rapide</h2>
              <div className="space-y-4">
                <button
                  onClick={openWhatsApp}
                  className="w-full flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl transition-colors"
                >
                  <MessageCircle className="w-6 h-6" />
                  Commander par WhatsApp
                </button>
                <a
                  href="tel:+22383806129"
                  className="w-full flex items-center justify-center gap-3 bg-white/20 hover:bg-white/30 text-white font-bold py-4 rounded-xl transition-colors"
                >
                  <Phone className="w-6 h-6" />
                  Appeler : +223 83 80 61 29
                </a>
              </div>
            </div>

            {/* Contact Cards */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="font-bold text-lg text-gray-900 mb-4">Nos Coordonnées</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[#E4002B]" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Adresse</p>
                    <p className="text-gray-600 text-sm">Baco-djicoroni Golf, HXGV+5X7</p>
                    <p className="text-gray-600 text-sm">Bamako, Mali 🇲🇱</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-[#E4002B]" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Téléphones</p>
                    <a href="tel:+22383806129" className="text-[#E4002B] hover:underline block">
                      +223 83 80 61 29
                    </a>
                    <a href="tel:+22374908709" className="text-[#E4002B] hover:underline block">
                      +223 74 90 87 09
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-[#E4002B]" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Email</p>
                    <a href="mailto:contact@r-chicken.com" className="text-[#E4002B] hover:underline">
                      contact@r-chicken.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-[#E4002B]" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Horaires d'ouverture</p>
                    <p className="text-gray-600 text-sm">Ouvert 24h/24 - 7j/7</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <h2 className="font-bold text-lg text-gray-900 p-6 pb-0">Notre Localisation</h2>
              <div className="p-6">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.5!2d-8.002!3d12.639!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDM4JzE4LjIiTiA4wrAwMCcwMS40Ilc!5e0!3m2!1sfr!2sml!4v1"
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  className="rounded-xl"
                  title="Carte R-CHICKEN Bamako"
                ></iframe>
              </div>
              <div className="px-6 pb-6">
                <a
                  href="https://maps.google.com/?q=Baco-djicoroni+Golf+Bamako+Mali"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-colors"
                >
                  📍 Ouvrir dans Google Maps
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="font-bold text-lg text-gray-900 mb-4">Envoyez-nous un message</h2>
            


            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Nom complet *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E4002B]"
                    placeholder="Votre nom"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Téléphone *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E4002B]"
                    placeholder="83 80 61 29"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email (optionnel)</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E4002B]"
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Sujet</label>
                <select
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E4002B] bg-white"
                >
                  <option value="">Choisir un sujet...</option>
                  <option value="commande">Question sur une commande</option>
                  <option value="information">Demande d'information</option>
                  <option value="suggestion">Suggestion</option>
                  <option value="reclamation">Réclamation</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Message *</label>
                <textarea
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E4002B] resize-none"
                  placeholder="Votre message..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Envoyer par WhatsApp
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="font-bold text-2xl text-gray-900 mb-6 text-center">Questions Fréquentes</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border-b border-gray-100 pb-4">
                <h3 className="font-bold text-gray-900 mb-2">Quels sont les modes de paiement acceptés ?</h3>
                <p className="text-gray-600 text-sm">Nous acceptons Orange Money, Sarali, Wave et les espèces à la livraison ou au retrait.</p>
              </div>
              <div className="border-b border-gray-100 pb-4">
                <h3 className="font-bold text-gray-900 mb-2">Quels sont les délais de livraison ?</h3>
                <p className="text-gray-600 text-sm">Notre livraison prend généralement 30 à 45 minutes selon votre quartier.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="border-b border-gray-100 pb-4">
                <h3 className="font-bold text-gray-900 mb-2">La livraison est-elle gratuite ?</h3>
                <p className="text-gray-600 text-sm">Oui, la livraison est gratuite pour toute commande supérieure à 20 000F.</p>
              </div>
              <div className="border-b border-gray-100 pb-4">
                <h3 className="font-bold text-gray-900 mb-2">Comment suivre ma commande ?</h3>
                <p className="text-gray-600 text-sm">Vous recevrez un appel de confirmation et serez tenu au courant de l'état de votre commande.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}