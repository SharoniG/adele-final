import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ProductsAdmin.module.css";
import type { Product } from "../../types/Product"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import AdminSidebar from "./AdminSidebar"

const categories = ['Hot', 'Music', 'Clothes', 'Accessories', 'Home'];

const ProductsAdmin = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Hot');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:3000/products/all", {
          credentials: "include",
        });
        const data = await res.json();
        setProducts(data.products);
      } catch (err) {
        console.error("Error getting products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (code: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`http://localhost:3000/products/delete/${code}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.productCode !== code)); //מוחק מהמערך אצ המוצר עם הקוד שמתאים לפי מה שנשלח בבקשה
      }
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const filtered = products.filter(p => p.category === selectedCategory);

  return (
      <div style={{ display: "flex" }}>
      <AdminSidebar />
    <div className={styles.container}>
      <h1 className={styles.heading}>Products Management</h1>

      <div className={styles.topBar}>
        <div className={styles.tabs}>
          {categories.map(cat => (
            <button
              key={cat}
              className={`${styles.tabBtn} ${selectedCategory === cat ? styles.active : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <button onClick={() => navigate("/admin/products/new")} className={styles.addBtn}>
          <FontAwesomeIcon icon={faPlus} /> Add Product
        </button>
      </div>

      {loading ? (
        <p className={styles.loading}>Loading products...</p>
      ) : (
        <div className={styles.tableWrapper}>
                   <table className={styles.table}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(product => (
                <tr key={product._id}>
                  <td><img src={product.imageUrl} width="100" alt={product.name} /></td>
                  <td>{product.name}</td>
                  <td>{product.price} $</td>
                  <td>{product.stock}</td>
                  <td>
                    <button
                      className={styles.editBtn}
                      onClick={() => navigate(`/products/update/${product.productCode}`)}
                    >
                      <FontAwesomeIcon icon={faPenToSquare} /> Update
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(product.productCode)}
                    >
                      <FontAwesomeIcon icon={faTrash} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </div>
  );
};

export default ProductsAdmin;