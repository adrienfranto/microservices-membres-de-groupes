import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://192.168.88.251:8080/api/product";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ id: "", name: "", description: "", price: "" });
  const [isEditing, setIsEditing] = useState(false);

  // Maka ny vokatra rehetra
  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_URL);
      setProducts(res.data);
    } catch (err) {
      console.error("Erreur GET:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Mandefa value amin'ny form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add or Update Product
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/${formData.id}`, formData);
        setIsEditing(false);
      } else {
        await axios.post(API_URL, formData);
      }
      setFormData({ id: "", name: "", description: "", price: "" });
      fetchProducts();
    } catch (err) {
      console.error("Erreur POST/PUT:", err);
    }
  };

  // Mamafa product
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Erreur DELETE:", err);
    }
  };

  // Manomana Edit
  const handleEdit = (product) => {
    setFormData(product);
    setIsEditing(true);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Product CRUD</h1>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        <input
          type="text"
          name="name"
          value={formData.name}
          placeholder="Product name"
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="description"
          value={formData.description}
          placeholder="Description"
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          placeholder="Price"
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {isEditing ? "Update" : "Add"}
        </button>
      </form>

      {/* Table Product */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="text-center">
              <td className="p-2 border">{p.name}</td>
              <td className="p-2 border">{p.description}</td>
              <td className="p-2 border">${p.price}</td>
              <td className="p-2 border space-x-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan="4" className="p-4 text-center text-gray-500">
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
