import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./NewProduct.module.css";
import { toast } from "react-hot-toast";


const categories = ['Hot', 'Music', 'Clothes', 'Accessories' , 'Home'];

const NewProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    description: "",
    category: "Hot",
    imageUrl: "",
    stock: 0,
    productCode: ""
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newValue = (name === "price" || name === "stock") ? Number(value) : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // בדיקות תקינות בסיסיות
  if (!formData.name.trim()) {
    return toast.error("Product name is required");
  }

  if (!formData.description.trim()) {
    return toast.error("Description is required");
  }

  if (formData.price <= 0) {
    return toast.error("Price must be greater than 0");
  }

  if (formData.stock < 0) {
    return toast.error("Stock cannot be negative");
  }

  if (!formData.imageUrl.trim()) {
    return toast.error("Image URL is required");
  }

  setLoading(true);
  try {
    const res = await fetch("http://localhost:3000/products/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      toast.success("Product was added");
      navigate("/admin/products");
    } else {
      toast.error("Error adding the product");
    }

  } catch (error) {
    toast.error("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Add New Product</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          Name:
          <input name="name" value={formData.name} onChange={handleChange} required />
        </label>

        <label>
          Description:
          <textarea
            name="description"
            rows={5}
            value={formData.description}
            onChange={handleChange}
            required
          />
        </label>

        <div className={styles.row}>
          <label>
            Price:
            <input type="number" name="price" value={formData.price} onChange={handleChange} required />
          </label>
          <label>
            Stock:
            <input type="number" name="stock" value={formData.stock} onChange={handleChange} required />
          </label>
        </div>

        <label>
          Category:
          <select name="category" value={formData.category} onChange={handleChange}>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>

        <label>
          Image URL:
          <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} required />
        </label>

      

        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? "Saving..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default NewProduct;