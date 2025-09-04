import React, { useState, useEffect } from "react";
import { X, Edit2, Trash2, Plus, User, Upload } from "lucide-react";

const Etudiant = () => {
  const [etudiants, setEtudiants] = React.useState([]);
  const [groupes, setGroupes] = React.useState([]);
  const [formData, setFormData] = React.useState({
    matricule:"",
    nom: "",
    prenoms: "",
    sexe: "",
    niveau: "",
    id_groupe: "",
    image: null,
  });
  const [isEditing, setIsEditing] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [studentToDelete, setStudentToDelete] = React.useState(null);
  const [imagePreview, setImagePreview] = React.useState(null);

  const ETUDIANT_API = "http://192.168.88.50:9000/api/etudiants";
  const GROUPE_API = "http://192.168.88.50:9000/api/groupes/list";

  const fetchEtudiants = async () => {
    try {
      const response = await fetch(ETUDIANT_API);
      const data = await response.json();
      setEtudiants(data);
    } catch (error) {
      console.error("Erreur récupération étudiants:", error);
    }
  };

  const fetchGroupes = async () => {
    try {
      const response = await fetch(GROUPE_API);
      const data = await response.json();
      setGroupes(data);
    } catch (error) {
      console.error("Erreur récupération groupes:", error);
    }
  };

  React.useEffect(() => {
    fetchEtudiants();
    fetchGroupes();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];
      setFormData({ ...formData, image: file });
      
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async () => {
    try {
      const data = new FormData();
      data.append("etudiant", new Blob([JSON.stringify({
        matricule: formData.matricule,
        nom: formData.nom,
        prenoms: formData.prenoms,
        sexe: formData.sexe,
        niveau: formData.niveau,
        id_groupe: formData.id_groupe,
      })], { type: "application/json" }));
      if (formData.image) data.append("image", formData.image);

      if (isEditing) {
        await fetch(`${ETUDIANT_API}/${formData.id}`, {
          method: 'PUT',
          body: data,
        });
      } else {
        await fetch(ETUDIANT_API, {
          method: 'POST',
          body: data,
        });
      }

      resetForm();
      fetchEtudiants();
    } catch (error) {
      console.error("Erreur enregistrement étudiant:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      matricule:"",
      nom: "",
      prenoms: "",
      sexe: "",
      niveau: "",
      id_groupe: "",
      image: null,
    });
    setIsEditing(false);
    setShowModal(false);
    setImagePreview(null);
  };

  const handleEdit = (etudiant) => {
    setFormData({
      ...etudiant,
      image: null,
    });
    setImagePreview(etudiant.image ? `http://192.168.88.50:9000${etudiant.image}` : null);
    setImagePreview(etudiant.image ? `http://192.168.88.50:9000${etudiant.image}` : null);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (studentToDelete) {
      try {
        await fetch(`${ETUDIANT_API}/${studentToDelete}`, { method: 'DELETE' });
        fetchEtudiants();
        setShowDeleteModal(false);
        setStudentToDelete(null);
      } catch (error) {
        console.error("Erreur suppression étudiant:", error);
      }
    }
  };

  const confirmDelete = (id) => {
    setStudentToDelete(id);
    setShowDeleteModal(true);
  };

  const getNomGroupe = (idGroupe) => {
    const id = Number(idGroupe);
    const groupe = groupes.find((g) => Number(g.id) === id);
    return groupe ? groupe.nomTravail : "-";
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
                <h1 className="text-2xl font-bold text-gray-900">Gestion des Étudiants</h1>
                <p className="text-gray-600 mt-1">Gérez les informations des étudiants</p>
              </div>
              <button
                onClick={openAddModal}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nouvel Étudiant
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>                  
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matricule</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>                  
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prénoms</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sexe</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Niveau</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Groupe</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {etudiants.map((etudiant) => (
                  <tr key={etudiant.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex-shrink-0 h-12 w-12">
                        {etudiant.image ? (
                          <img
                            className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
                            src={`http://192.168.88.50:9000${etudiant.image}`}
                            alt={etudiant.nom}
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{etudiant.matricule}</td>                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{etudiant.nom}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{etudiant.prenoms}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        etudiant.sexe === 'Masculin' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                      }`}>
                        {etudiant.sexe}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {etudiant.niveau}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getNomGroupe(etudiant.id_groupe)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(etudiant)}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => confirmDelete(etudiant.id)}
                          className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Ajout/Modification */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {isEditing ? "Modifier l'étudiant" : "Nouvel étudiant"}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Image Preview */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-24 w-24 rounded-full object-cover border-4 border-gray-200 shadow-sm"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-200">
                      <User className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="file"
                    name="image"
                    onChange={handleChange}
                    className="sr-only"
                    accept="image/*"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choisir une image
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                {/* Première ligne : Nom et Prénoms */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                    <input
                      type="text"
                      name="nom"
                      placeholder="Nom"
                      value={formData.nom}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prénoms</label>
                    <input
                      type="text"
                      name="prenoms"
                      placeholder="Prénoms"
                      value={formData.prenoms}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      required
                    />
                  </div>
                </div>

                {/* Deuxième ligne : Sexe et Niveau */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sexe</label>
                    <select
                      name="sexe"
                      value={formData.sexe}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      required
                    >
                      <option value="">Sélectionner le sexe</option>
                      <option value="Masculin">Masculin</option>
                      <option value="Féminin">Féminin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
                    <select
                      name="niveau"
                      value={formData.niveau}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      required
                    >
                      <option value="">Sélectionner le niveau</option>
                      <option value="L1">L1</option>
                      <option value="L2">L2</option>
                      <option value="L3">L3</option>
                      <option value="M1">M1</option>
                      <option value="M2">M2</option>
                    </select>
                  </div>
                </div>

                {/* Troisième ligne : Groupe  et matricule*/}
                <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Matricule</label>
                    <input
                      type="text"
                      name="matricule"
                      placeholder="Matricule"
                      value={formData.matricule}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      required
                    />
                  </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Groupe</label>
                  <select
                    name="id_groupe"
                    value={formData.id_groupe}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    required
                  >
                    <option value="">Sélectionner un groupe</option>
                    {groupes.map((g) => (
                      <option key={g.id} value={g.id}>{g.nomTravail}</option>
                    ))}
                  </select>
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
                  {isEditing ? "Modifier" : "Ajouter"}
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
                    Êtes-vous sûr de vouloir supprimer cet étudiant ? Cette action ne peut pas être annulée.
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 flex space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setStudentToDelete(null);
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

export default Etudiant;