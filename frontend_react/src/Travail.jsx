import React, { useState, useEffect } from "react";
import { X, Edit2, Trash2, Plus, Briefcase, DollarSign, Hash, FileText } from "lucide-react";

const Travail = () => {
  const [travaux, setTravaux] = React.useState([]);
  const [groupes, setGroupes] = React.useState([]);
  const [form, setForm] = React.useState({
    ordreTravail: "",
    nomTravail: "",
    detailTravail: "",
    salaire: "",
    quantite: "",
  });
  const [editId, setEditId] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [travailToDelete, setTravailToDelete] = React.useState(null);

  const TRAVAIL_API = "http://192.168.88.50:9000/api/travail";
  const GROUPE_API = "http://192.168.88.50:9000/api/groupes/list";

  React.useEffect(() => {
    fetchTravaux();
    fetchGroupes();
  }, []);

  const fetchTravaux = async () => {
    try {
      const res = await fetch(TRAVAIL_API);
      const data = await res.json();
      setTravaux(data);
    } catch (err) {
      console.error("Erreur récupération travaux :", err);
    }
  };

  const fetchGroupes = async () => {
    try {
      const res = await fetch(GROUPE_API);
      const data = await res.json();
      setGroupes(data);
    } catch (err) {
      console.error("Erreur récupération groupes :", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editId) {
        await fetch(`${TRAVAIL_API}/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      } else {
        await fetch(TRAVAIL_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      }
      resetForm();
      fetchTravaux();
    } catch (err) {
      console.error("Erreur enregistrement :", err);
    }
  };

  const resetForm = () => {
    setForm({ ordreTravail: "", nomTravail: "", detailTravail: "", salaire: "", quantite: "" });
    setEditId(null);
    setShowModal(false);
  };

  const handleDelete = async () => {
    if (travailToDelete) {
      try {
        await fetch(`${TRAVAIL_API}/${travailToDelete}`, { method: 'DELETE' });
        fetchTravaux();
        setShowDeleteModal(false);
        setTravailToDelete(null);
      } catch (err) {
        console.error("Erreur suppression :", err);
      }
    }
  };

  const confirmDelete = (id) => {
    setTravailToDelete(id);
    setShowDeleteModal(true);
  };

  const handleEdit = (travail) => {
    setForm(travail);
    setEditId(travail.id);
    setShowModal(true);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestion des Travaux</h1>
                <p className="text-gray-600 mt-1">Gérez les ordres de travail et leurs détails</p>
              </div>
              <button
                onClick={openAddModal}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nouveau Travail
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Briefcase className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Travaux</p>
                <p className="text-2xl font-bold text-gray-900">{travaux.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Budget Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {travaux.reduce((sum, t) => sum + parseFloat(t.salaire || 0), 0).toLocaleString()} €
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Hash className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Quantité Totale</p>
                <p className="text-2xl font-bold text-gray-900">
                  {travaux.reduce((sum, t) => sum + parseInt(t.quantite || 0), 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Salaire Moyen</p>
                <p className="text-2xl font-bold text-gray-900">
                  {travaux.length > 0 ? Math.round(travaux.reduce((sum, t) => sum + parseFloat(t.salaire || 0), 0) / travaux.length).toLocaleString() : 0} €
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Liste des Travaux</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ordre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Détail</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salaire</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {travaux.map((travail) => (
                  <tr key={travail.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{travail.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {travail.ordreTravail}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                            <Briefcase className="h-4 w-4 text-purple-600" />
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{travail.nomTravail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {travail.detailTravail}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {parseFloat(travail.salaire).toLocaleString()} €
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {travail.quantite}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(travail)}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => confirmDelete(travail.id)}
                          className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {travaux.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-lg font-medium">Aucun travail trouvé</p>
                      <p className="mt-1">Commencez par créer votre premier travail.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Ajout/Modification */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editId ? "Modifier le travail" : "Nouveau travail"}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Icon Section */}
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <Briefcase className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <div className="space-y-4">
                {/* Première ligne : Ordre Travail et Nom Travail */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ordre Travail
                    </label>
                    <input
                      type="text"
                      name="ordreTravail"
                      placeholder="Ordre Travail"
                      value={form.ordreTravail}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom Travail
                    </label>
                    <select
                      name="nomTravail"
                      value={form.nomTravail}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      required
                    >
                      <option value="">Choisir un travail</option>
                      {groupes.map((g) => (
                        <option key={g.id} value={g.nomTravail}>
                          {g.nomTravail}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Deuxième ligne : Détail Travail */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Détail du Travail
                  </label>
                  <textarea
                    name="detailTravail"
                    placeholder="Détail du travail"
                    value={form.detailTravail}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                </div>

                {/* Troisième ligne : Salaire et Quantité */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Salaire (€)
                    </label>
                    <input
                      type="number"
                      name="salaire"
                      placeholder="Salaire"
                      value={form.salaire}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantité
                    </label>
                    <input
                      type="number"
                      name="quantite"
                      placeholder="Quantité"
                      value={form.quantite}
                      onChange={handleChange}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  {editId ? "Modifier" : "Créer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Confirmer la suppression</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Êtes-vous sûr de vouloir supprimer ce travail ? Cette action ne peut pas être annulée.
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 flex space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setTravailToDelete(null);
                }}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 transition-colors duration-200"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Travail;