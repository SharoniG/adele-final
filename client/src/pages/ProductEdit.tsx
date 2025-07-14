import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Product } from "../types/Product";
import styles from "./ProductEdit.module.css";

const categories = ['Hot', 'Music', 'Clothes', 'Accessories' , 'Home'];

const ProductEdit = () => {
  const { code } = useParams();  // החזרת הפרמטר שמופיע בכתובת, אחר כך נשתמש בזה בפונקציות הבאות בשביל להביא את המוצר עם המזהה
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:3000/products/code/${code}`);
        const data = await res.json();
        setFormData(data);
      } catch (err) {
        console.error("error:", err);
      }
    };

    if (code) fetchProduct();
  }, [code]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });  
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3000/products/code/${code}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (res.ok) {
        navigate(`/products/code/${code}`);
      }
    } catch (err) {
      console.error("error:", err);
    }
  };

  if (!formData) return <p>Loading ...</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Edit Product</h2>
      <div className={styles.content}>
        <div className={styles.imageContainer}>
          <img src={formData.imageUrl} alt={formData.name} className={styles.image} />
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            Title
            <input name="name" value={formData.name} onChange={handleChange} required />
          </label>
          <label>
            Description
            <textarea name="description" value={formData.description} onChange={handleChange} />
          </label>
           <label>
          Category:
          <select name="category" value={formData.category} onChange={handleChange}>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>
          <label>
            Image Link
            <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
          </label>
          <div className={styles.row}>
            <label>
              Price
              <input name="price" type="number" value={formData.price} onChange={handleChange} required />
            </label>
            <label>
              Stock
              <input name="stock" type="number" value={formData.stock} onChange={handleChange} required />
            </label>
          </div>
          <button type="submit" className={styles.saveButton}>Save</button>
        </form>
      </div>
    </div>
  );
};

export default ProductEdit;