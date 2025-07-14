import { useEffect, useState } from "react";
import styles from "./Home.module.css";
import type { Product } from "../types/Product";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faInstagram, faTwitter, faYoutube, } from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";

function Home() {

  const [hotProducts, setHotProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchHotProducts = async () => {
      try {
        const res = await fetch("http://localhost:3000/products/category/Hot");
        const data = await res.json();
        setHotProducts(data || []);
      } catch (error) {
        console.error("Error fetching hot products:", error);
      }
    };
    fetchHotProducts();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.banner}>
        <img src="/banner3.png" alt="Adele Banner" />
      </div>

      <section className={styles.hotSection}>
        <div className={styles.hotHeader}>
          <h2 className={styles.hotTitle}>HOT RIGHT NOW</h2>
          <button
            className={styles.viewAll}
            onClick={() => window.location.href = "/products"}
          >
            VIEW ALL
          </button>
        </div>

        <div className={styles.productsRow}>
          {hotProducts.slice(0, 5).map(product => (
            <Link key={product._id} to={`/products/code/${product.productCode}`} >
              <div className={styles.productCard}>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  width="100%"
                  style={{ objectFit: "cover", height: "150px" }}
                />

                <p className={styles.productName}>{product.name}</p>
                <p className={styles.productPrice}>{product.price.toFixed(2)} $</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.socialSection}>
          <a href="https://facebook.com" target="_blank">
            <FontAwesomeIcon icon={faFacebookF} className={styles.socialIcon} />
          </a>
          <a href="https://instagram.com" target="_blank" >
            <FontAwesomeIcon icon={faInstagram} className={styles.socialIcon} />
          </a>
          <a href="https://twitter.com" target="_blank" >
            <FontAwesomeIcon icon={faTwitter} className={styles.socialIcon} />
          </a>
          <a href="https://youtube.com" target="_blank" >
            <FontAwesomeIcon icon={faYoutube} className={styles.socialIcon} />
          </a>
        </div>

        <div className={styles.legal}>
          <p>© 2025 Sharon Golani</p>
        </div>
      </footer>
    </div>

  );
}

export default Home;
