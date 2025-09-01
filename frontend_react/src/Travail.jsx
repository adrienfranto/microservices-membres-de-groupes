import React, { useState, useEffect } from "react";
import axios from "axios";

const Travail = () => {
  const [travaux, setTravaux] = useState([]);
  const [groupes, setGroupes] = useState([]);
  const [form, setForm] = useState({
    ordreTravail: "",
    nomTravail: "",
    detailTravail: "",
    salaire: "",
    quantite: "",
  });
  const [editId, setEditId] = useState(null);

  const TRAVAIL_API = "http://192.168.88.251:9000/api/travail";
  const GROUPE_API = "http://192.168.88.251:9000/api/groupes/list";

  // Fetch travaux et groupes
  useEffect(() => {
    fetchTravaux();
    fetchGroupes();
  }, []);

  const fetchTravaux = async () => {
    try {
      const res = await axios.get(TRAVAIL_API);
      setTravaux(res.data);
    } catch (err) {
      console.error("Erreur récupération travaux :", err);
    }
  };

  const fetchGroupes = async () => {
    try {
      const res = await axios.get(GROUPE_API);
      setGroupes(res.data);
    } catch (err) {
      console.error("Erreur récupération groupes :", err);
    }
  };

  // Gestion input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Ajouter ou Modifier
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${TRAVAIL_API}/${editId}`, form);
      } else {
        await axios.post(TRAVAIL_API, form);
      }
      setForm({ ordreTravail: "", nomTravail: "", detailTravail: "", salaire: "", quantite: "" });
      setEditId(null);
      fetchTravaux();
    } catch (err) {
      console.error("Erreur enregistrement :", err);
    }
  };

  // Supprimer
  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous supprimer ?")) {
      try {
        await axios.delete(`${TRAVAIL_API}/${id}`);
        fetchTravaux();
      } catch (err) {
        console.error("Erreur suppression :", err);
      }
    }
  };

  // Charger pour modification
  const handleEdit = (travail) => {
    setForm(travail);
    setEditId(travail.id);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Gestion des Travaux</h2>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <input
          type="text"
          name="ordreTravail"
          placeholder="Ordre Travail"
          value={form.ordreTravail}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        {/* Select NomTravail depuis Groupes */}
        <select
          name="nomTravail"
          value={form.nomTravail}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        >
          <option value="">--Choisir un travail--</option>
          {groupes.map((g) => (
            <option key={g.id} value={g.nomTravail}>
              {g.nomTravail} {/* si groupe a nomGroupe, mettre `${g.nomTravail} - ${g.nomGroupe}` */}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="detailTravail"
          placeholder="Détail"
          value={form.detailTravail}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          type="number"
          name="salaire"
          placeholder="Salaire"
          value={form.salaire}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          type="number"
          name="quantite"
          placeholder="Quantité"
          value={form.quantite}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {editId ? "Modifier" : "Ajouter"}
        </button>
      </form>

      {/* Liste */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Ordre</th>
            <th className="border p-2">Nom</th>
            <th className="border p-2">Détail</th>
            <th className="border p-2">Salaire</th>
            <th className="border p-2">Quantité</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {travaux.map((t) => (
            <tr key={t.id}>
              <td className="border p-2">{t.id}</td>
              <td className="border p-2">{t.ordreTravail}</td>
              <td className="border p-2">{t.nomTravail}</td>
              <td className="border p-2">{t.detailTravail}</td>
              <td className="border p-2">{t.salaire}</td>
              <td className="border p-2">{t.quantite}</td>
              <td className="border p-2 space-x-2">
                <button onClick={() => handleEdit(t)} className="bg-yellow-500 text-white px-2 rounded">Éditer</button>
                <button onClick={() => handleDelete(t.id)} className="bg-red-500 text-white px-2 rounded">Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Travail;
