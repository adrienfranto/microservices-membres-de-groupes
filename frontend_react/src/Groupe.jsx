import React, { useState, useEffect } from "react";
import { X, Edit2, Trash2, Plus, Users, Hash } from "lucide-react";

const Groupe = () => {
  const [groupes, setGroupes] = React.useState([]);
  const [formData, setFormData] = React.useState({
    id: "",
    nomTravail: "",
    quantite: "",
  });
  const [isEditing, setIsEditing] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [groupeToDelete, setGroupeToDelete] = React.useState(null);

  const API_URL = "http://192.168.88.13:9000/api/groupes";

  const fetchGroupes = async () => {
    try {
      const response = await fetch(API_URL + "/list");
      const data = await response.json();
      setGroupes(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des groupes:", error);
    }
  };

  React.useEffect(() => {
    fetchGroupes();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await fetch(`${API_URL}/${formData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }
      resetForm();
      fetchGroupes();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du groupe:", error);
    }
  };

  const resetForm = () => {
    setFormData({ id: "", nomTravail: "", quantite: "" });
    setIsEditing(false);
    setShowModal(false);
  };

  const handleEdit = (groupe) => {
    setFormData(groupe);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (groupeToDelete) {
      try {
        await fetch(`${API_URL}/${groupeToDelete}`, { method: 'DELETE' });
        fetchGroupes();
        setShowDeleteModal(false);
        setGroupeToDelete(null);
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  const confirmDelete = (id) => {
    setGroupeToDelete(id);
    setShowDeleteModal(true);
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
                <h1 className="text-2xl font-bold text-gray-900">Gestion des Groupes</h1>
                <p className="text-gray-600 mt-1">Gérez les groupes de travail</p>
              </div>
              <button
                onClick={openAddModal}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nouveau Groupe
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Groupes</p>
                <p className="text-2xl font-bold text-gray-900">{groupes.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Hash className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Capacité Totale</p>
                <p className="text-2xl font-bold text-gray-900">
                  {groupes.reduce((sum, groupe) => sum + parseInt(groupe.quantite || 0), 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Capacité Moyenne</p>
                <p className="text-2xl font-bold text-gray-900">
                  {groupes.length > 0 ? Math.round(groupes.reduce((sum, groupe) => sum + parseInt(groupe.quantite || 0), 0) / groupes.length) : 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Liste des Groupes</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom du Travail
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {groupes.map((groupe) => (
                  <tr key={groupe.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Users className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{groupe.nomTravail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        {groupe.quantite} places
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(groupe)}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => confirmDelete(groupe.id)}
                          className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {groupes.length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-6 py-12 text-center text-gray-500">
                      <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-lg font-medium">Aucun groupe trouvé</p>
                      <p className="mt-1">Commencez par créer votre premier groupe.</p>
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
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[70vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {isEditing ? "Modifier le groupe" : "Nouveau groupe"}
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
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du Travail
                  </label>
                  <input
                    type="text"
                    name="nomTravail"
                    placeholder="Nom du Travail"
                    value={formData.nomTravail}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    required
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
                    value={formData.quantite}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    required
                  />
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
                  {isEditing ? "Modifier" : "Créer"}
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
                    Êtes-vous sûr de vouloir supprimer ce groupe ? Cette action ne peut pas être annulée.
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 flex space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setGroupeToDelete(null);
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

export default Groupe;
