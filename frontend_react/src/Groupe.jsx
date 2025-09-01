import React, { useState, useEffect } from "react";
import axios from "axios";

const Groupe = () => {
  const [groupes, setGroupes] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    nomTravail: "",
    quantite: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const API_URL = "http://192.168.88.251:9000/api/groupes";

  // Fetch all groupes
  const fetchGroupes = async () => {
    try {
      const response = await axios.get(API_URL+"/list");
      setGroupes(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des groupes:", error);
    }
  };

  useEffect(() => {
    fetchGroupes();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle add or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/${formData.id}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      setFormData({ id: "", nomTravail: "", quantite: "" });
      setIsEditing(false);
      fetchGroupes();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du groupe:", error);
    }
  };

  // Handle edit
  const handleEdit = (groupe) => {
    setFormData(groupe);
    setIsEditing(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce groupe ?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchGroupes();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestion des Groupes</h1>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="nomTravail"
            placeholder="Nom du Travail"
            value={formData.nomTravail}
            onChange={handleChange}
            className="border p-2"
            required
          />
          <input
            type="number"
            name="quantite"
            placeholder="Quantité"
            value={formData.quantite}
            onChange={handleChange}
            className="border p-2"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          {isEditing ? "Modifier" : "Ajouter"}
        </button>
      </form>

      {/* Liste des groupes */}
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Nom Travail</th>
            <th className="border p-2">Quantité</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {groupes.map((groupe) => (
            <tr key={groupe.id}>
              <td className="border p-2">{groupe.nomTravail}</td>
              <td className="border p-2">{groupe.quantite}</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleEdit(groupe)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(groupe.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Groupe;
