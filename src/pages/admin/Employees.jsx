import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Users, Plus, Search, Edit, Trash2, Phone, Mail, MapPin, Shield } from 'lucide-react';

export default function Employees() {
  const [employees, setEmployees] = useState([
    { id: 1, name: 'Moussa Diallo', role: 'Cuisinier', phone: '83 12 34 56', status: 'actif' },
    { id: 2, name: 'Fatoumata Traoré', role: 'Caissière', phone: '79 23 45 67', status: 'actif' },
    { id: 3, name: 'Ibrahim Keita', role: 'Livreur', phone: '65 34 56 78', status: 'actif' },
    { id: 4, name: 'Aminata Coulibaly', role: 'Gérante', phone: '90 45 67 89', status: 'actif' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '', role: 'Cuisinier', phone: '' });

  const roles = ['Gérant', 'Cuisinier', 'Caissière', 'Livreur', 'Manager'];

  const addEmployee = () => {
    if (newEmployee.name && newEmployee.phone) {
      setEmployees([...employees, {
        id: Date.now(),
        ...newEmployee,
        status: 'actif'
      }]);
      setNewEmployee({ name: '', role: 'Cuisinier', phone: '' });
      setShowModal(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900">👥 Employés & RH</h1>
            <p className="text-gray-500 mt-1">Gérez vos employés et leurs accès</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="kfc-button text-white px-4 py-2 rounded-xl font-bold inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Ajouter un employé
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <p className="text-2xl font-black text-gray-900">{employees.length}</p>
            <p className="text-sm text-gray-500">Total employés</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <p className="text-2xl font-black text-green-600">{employees.filter(e => e.status === 'actif').length}</p>
            <p className="text-sm text-gray-500">Actifs</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <p className="text-2xl font-black text-blue-600">{employees.filter(e => e.role === 'Cuisinier').length}</p>
            <p className="text-sm text-gray-500">Cuisiniers</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <p className="text-2xl font-black text-purple-600">{employees.filter(e => e.role === 'Livreur').length}</p>
            <p className="text-sm text-gray-500">Livreurs</p>
          </div>
        </div>

        {/* Employees List */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-2">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un employé..."
                className="bg-transparent flex-1 outline-none text-sm"
              />
            </div>
          </div>
          
          <div className="divide-y">
            {employees.map(employee => (
              <div key={employee.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#E4002B] rounded-full flex items-center justify-center text-white font-bold">
                    {employee.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{employee.name}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        {employee.role}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {employee.phone}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    employee.status === 'actif' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {employee.status}
                  </span>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Edit className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Ajouter un employé</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Nom complet</label>
                  <input
                    type="text"
                    value={newEmployee.name}
                    onChange={e => setNewEmployee({...newEmployee, name: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200"
                    placeholder="Nom et prénom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Rôle</label>
                  <select
                    value={newEmployee.role}
                    onChange={e => setNewEmployee({...newEmployee, role: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200"
                  >
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Téléphone</label>
                  <input
                    type="text"
                    value={newEmployee.phone}
                    onChange={e => setNewEmployee({...newEmployee, phone: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200"
                    placeholder="83 12 34 56"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl font-bold"
                >
                  Annuler
                </button>
                <button
                  onClick={addEmployee}
                  className="flex-1 kfc-button text-white px-4 py-2 rounded-xl font-bold"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}