import React, { useState, useEffect } from "react";
import axios from "axios";

const Etudiant = () => {
  const [etudiants, setEtudiants] = useState([]);
  const [groupes, setGroupes] = useState([]);
  const [formData, setFormData] = useState({
    matricule: "",
    nom: "",
    prenoms: "",
    sexe: "",
    niveau: "",
    id_groupe: "",
    image: null, // pour stocker le fichier image
  });
  const [isEditing, setIsEditing] = useState(false);

  const ETUDIANT_API = "http://192.168.88.251:9000/api/etudiants";
  const GROUPE_API = "http://192.168.88.251:9000/api/groupes/list";

  // Fetch étudiants
  const fetchEtudiants = async () => {
    try {
      const response = await axios.get(ETUDIANT_API);
      setEtudiants(response.data);
    } catch (error) {
      console.error("Erreur récupération étudiants:", error);
    }
  };

  // Fetch groupes
  const fetchGroupes = async () => {
    try {
      const response = await axios.get(GROUPE_API);
      setGroupes(response.data);
    } catch (error) {
      console.error("Erreur récupération groupes:", error);
    }
  };

  useEffect(() => {
    fetchEtudiants();
    fetchGroupes();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        await axios.put(`${ETUDIANT_API}/${formData.id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(ETUDIANT_API, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setFormData({
        matricule: "",
        nom: "",
        prenoms: "",
        sexe: "",
        niveau: "",
        id_groupe: "",
        image: null,
      });
      setIsEditing(false);
      fetchEtudiants();
    } catch (error) {
      console.error("Erreur enregistrement étudiant:", error);
    }
  };

  const handleEdit = (etudiant) => {
    setFormData({
      ...etudiant,
      image: null, // reset image
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet étudiant ?")) {
      try {
        await axios.delete(`${ETUDIANT_API}/${id}`);
        fetchEtudiants();
      } catch (error) {
        console.error("Erreur suppression étudiant:", error);
      }
    }
  };

  const getNomGroupe = (idGroupe) => {
    const id = Number(idGroupe);
    const groupe = groupes.find((g) => Number(g.id) === id);
    return groupe ? groupe.nomTravail : "-";
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestion des Étudiants</h1>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          <input type="text" name="matricule" placeholder="Matricule" value={formData.matricule} onChange={handleChange} className="border p-2" required />
          <input type="text" name="nom" placeholder="Nom" value={formData.nom} onChange={handleChange} className="border p-2" required />
          <input type="text" name="prenoms" placeholder="Prénoms" value={formData.prenoms} onChange={handleChange} className="border p-2" required />
          <select name="sexe" value={formData.sexe} onChange={handleChange} className="border p-2" required>
            <option value="">--Sexe--</option>
            <option value="Masculin">Masculin</option>
            <option value="Féminin">Féminin</option>
          </select>
          <input type="text" name="niveau" placeholder="Niveau" value={formData.niveau} onChange={handleChange} className="border p-2" required />
          <select name="id_groupe" value={formData.id_groupe} onChange={handleChange} className="border p-2" required>
            <option value="">--Groupe--</option>
            {groupes.map((g) => (
              <option key={g.id} value={g.id}>{g.nomTravail}</option>
            ))}
          </select>
          <input type="file" name="image" onChange={handleChange} className="border p-2 col-span-2" accept="image/*" />
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          {isEditing ? "Modifier" : "Ajouter"}
        </button>
      </form>

      {/* Liste des étudiants */}
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Image</th>
            <th className="border p-2">Matricule</th>
            <th className="border p-2">Nom</th>
            <th className="border p-2">Prénoms</th>
            <th className="border p-2">Sexe</th>
            <th className="border p-2">Niveau</th>
            <th className="border p-2">Groupe</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {etudiants.map((etudiant) => (
            <tr key={etudiant.id}>
              <td className="border p-2">
                {etudiant.image && (
                  <img src={`http://192.168.88.251:9000${etudiant.image}`} alt={etudiant.nom} className="w-16 h-16 object-cover" />
                )}
              </td>
              <td className="border p-2">{etudiant.matricule}</td>
              <td className="border p-2">{etudiant.nom}</td>
              <td className="border p-2">{etudiant.prenoms}</td>
              <td className="border p-2">{etudiant.sexe}</td>
              <td className="border p-2">{etudiant.niveau}</td>
              <td className="border p-2">{getNomGroupe(etudiant.id_groupe)}</td>
              <td className="border p-2 space-x-2">
                <button onClick={() => handleEdit(etudiant)} className="bg-yellow-500 text-white px-2 py-1 rounded">Modifier</button>
                <button onClick={() => handleDelete(etudiant.id)} className="bg-red-500 text-white px-2 py-1 rounded">Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Etudiant;
