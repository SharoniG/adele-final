import { useEffect, useState } from "react";
import type { Product } from "../types/Product";
import ProductCard from "../components/ProductCard";
import styles from "./Products.module.css";

const categories = ["Hot", "Music", "Clothes", "Accessories", "Home"];

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Hot"); // ערך ברירת מחדל של ״חם״ כי אני רוצה להביא רק הפריטים מהקטגוריה הזאת

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:3000/products/all");
        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(
    (product) => product.category === selectedCategory
  );

  if (loading) return <p className={styles.loading}>Loading...</p>;

  return (
    <div className={styles.container}>

      <aside className={styles.sidebar}>
        <h3 className={styles.sidebarTitle}>Categories</h3>
        <ul className={styles.categoryList}>
          {categories.map((cat) => (
            <li
              key={cat}
              className={`${styles.categoryItem} ${
                selectedCategory === cat ? styles.active : ""
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </li>
          ))}
        </ul>
      </aside>

      <main className={styles.main}>
        <h1 className={styles.title}>{selectedCategory}</h1>
        <div className={styles.productsGrid}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.productCode} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Products;