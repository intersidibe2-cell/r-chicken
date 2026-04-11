import { Receipt } from 'lucide-react';

export default function Orders() {
  return (
    <main className="pt-20 min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <Receipt className="w-24 h-24 mx-auto mb-6 text-gray-300" />
        <h1 className="text-3xl font-black text-gray-700 mb-3">Vos Commandes</h1>
        <p className="text-gray-500">Aucune commande pour le moment.</p>
        <p className="text-sm text-gray-400 mt-2">Vos commandes apparaîtront ici une fois passées.</p>
      </div>
    </main>
  );
}
