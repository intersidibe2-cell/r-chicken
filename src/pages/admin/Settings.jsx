import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Save, Clock, MapPin, Phone, Mail, Bell } from 'lucide-react';

const SETTINGS_KEY = 'rchicken_settings';

const defaultSettings = {
  name: 'R-CHICKEN',
  tagline: 'Le Poulet Croustillant Malien',
  phone: '+223 83 80 61 29',
  phone2: '+223 74 90 87 09',
  email: 'contact@r-chicken.com',
  address: 'Baco-djicoroni Golf, HXGV+5X7, Bamako, Mali',
  isOpen: true,
  minOrder: 2000,
  deliveryFee: 1500,
  freeDeliveryFrom: 20000,
  deliveryTime: '30-45',
  tiktok: '@rouski_chicken',
  schedules: {
    monday: { open: '11:00', close: '23:00', active: true },
    tuesday: { open: '11:00', close: '23:00', active: true },
    wednesday: { open: '11:00', close: '23:00', active: true },
    thursday: { open: '11:00', close: '23:00', active: true },
    friday: { open: '11:00', close: '23:00', active: true },
    saturday: { open: '11:00', close: '00:00', active: true },
    sunday: { open: '12:00', close: '22:00', active: true },
  },
  notifications: {
    newOrder: true,
    orderStatus: true,
    lowStock: true,
    dailyReport: false,
  },
};

export default function AdminSettings() {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const days = [
    { key: 'monday', label: 'Lundi' },
    { key: 'tuesday', label: 'Mardi' },
    { key: 'wednesday', label: 'Mercredi' },
    { key: 'thursday', label: 'Jeudi' },
    { key: 'friday', label: 'Vendredi' },
    { key: 'saturday', label: 'Samedi' },
    { key: 'sunday', label: 'Dimanche' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Paramètres</h1>
            <p className="text-gray-500 mt-1">Configuration du restaurant</p>
          </div>
          <button
            onClick={handleSave}
            className="kfc-button text-white px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            Enregistrer
          </button>
        </div>

        {saved && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 font-bold">
            ✅ Paramètres enregistrés avec succès !
          </div>
        )}

        {/* General Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-lg text-gray-900 mb-6">📋 Informations générales</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Nom du restaurant</label>
              <input
                type="text"
                value={settings.name}
                onChange={e => setSettings({ ...settings, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E4002B]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Slogan</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={e => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E4002B]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Téléphone principal</label>
              <input
                type="tel"
                value={settings.phone}
                onChange={e => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E4002B]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Téléphone secondaire</label>
              <input
                type="tel"
                value={settings.phone2}
                onChange={e => setSettings({ ...settings, phone2: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E4002B]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={e => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E4002B]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">TikTok</label>
              <input
                type="text"
                value={settings.tiktok}
                onChange={e => setSettings({ ...settings, tiktok: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E4002B]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">Adresse</label>
              <input
                type="text"
                value={settings.address}
                onChange={e => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E4002B]"
              />
            </div>
          </div>
        </div>

        {/* Restaurant Status */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-lg text-gray-900 mb-6">🟢 Statut du restaurant</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSettings({ ...settings, isOpen: !settings.isOpen })}
              className={`relative w-16 h-8 rounded-full transition-colors ${settings.isOpen ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${settings.isOpen ? 'left-9' : 'left-1'}`} />
            </button>
            <div>
              <p className="font-bold text-gray-900">{settings.isOpen ? 'Restaurant OUVERT' : 'Restaurant FERMÉ'}</p>
              <p className="text-sm text-gray-500">Les clients peuvent {settings.isOpen ? 'passer des commandes' : 'consulter le menu uniquement'}</p>
            </div>
          </div>
        </div>

        {/* Delivery Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-lg text-gray-900 mb-6">🚚 Livraison</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Commande minimum (FCFA)</label>
              <input
                type="number"
                value={settings.minOrder}
                onChange={e => setSettings({ ...settings, minOrder: parseInt(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E4002B]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Frais de livraison (FCFA)</label>
              <input
                type="number"
                value={settings.deliveryFee}
                onChange={e => setSettings({ ...settings, deliveryFee: parseInt(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E4002B]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Livraison gratuite dès (FCFA)</label>
              <input
                type="number"
                value={settings.freeDeliveryFrom}
                onChange={e => setSettings({ ...settings, freeDeliveryFrom: parseInt(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E4002B]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Temps de livraison (min)</label>
              <input
                type="text"
                value={settings.deliveryTime}
                onChange={e => setSettings({ ...settings, deliveryTime: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E4002B]"
                placeholder="30-45"
              />
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-lg text-gray-900 mb-6">🕐 Horaires d'ouverture</h2>
          <div className="space-y-3">
            {days.map(day => {
              const schedule = settings.schedules[day.key];
              return (
                <div key={day.key} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
                  <label className="flex items-center gap-2 w-32">
                    <input
                      type="checkbox"
                      checked={schedule.active}
                      onChange={e => setSettings({
                        ...settings,
                        schedules: {
                          ...settings.schedules,
                          [day.key]: { ...schedule, active: e.target.checked }
                        }
                      })}
                      className="w-4 h-4 text-[#E4002B] rounded"
                    />
                    <span className="text-sm font-bold text-gray-700">{day.label}</span>
                  </label>
                  {schedule.active && (
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={schedule.open}
                        onChange={e => setSettings({
                          ...settings,
                          schedules: {
                            ...settings.schedules,
                            [day.key]: { ...schedule, open: e.target.value }
                          }
                        })}
                        className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#E4002B] text-sm"
                      />
                      <span className="text-gray-400">→</span>
                      <input
                        type="time"
                        value={schedule.close}
                        onChange={e => setSettings({
                          ...settings,
                          schedules: {
                            ...settings.schedules,
                            [day.key]: { ...schedule, close: e.target.value }
                          }
                        })}
                        className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#E4002B] text-sm"
                      />
                    </div>
                  )}
                  {!schedule.active && (
                    <span className="text-sm text-gray-400">Fermé</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-lg text-gray-900 mb-6">🔔 Notifications</h2>
          <div className="space-y-4">
            {[
              { key: 'newOrder', label: 'Nouvelle commande', desc: 'Recevoir une alerte à chaque nouvelle commande' },
              { key: 'orderStatus', label: 'Changement de statut', desc: 'Notification quand le statut d\'une commande change' },
              { key: 'lowStock', label: 'Stock faible', desc: 'Alerte quand un produit est bientôt en rupture' },
              { key: 'dailyReport', label: 'Rapport quotidien', desc: 'Résumé des ventes envoyé chaque soir' },
            ].map(notif => (
              <div key={notif.key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-bold text-sm text-gray-900">{notif.label}</p>
                  <p className="text-xs text-gray-500">{notif.desc}</p>
                </div>
                <button
                  onClick={() => setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      [notif.key]: !settings.notifications[notif.key]
                    }
                  })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.notifications[notif.key] ? 'bg-[#E4002B]' : 'bg-gray-300'
                  }`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings.notifications[notif.key] ? 'left-6' : 'left-0.5'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
