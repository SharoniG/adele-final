import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { Product } from "../types/Product";
import { addToCart } from "../../redux/store";
import styles from "./ProductDetails.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus, faTrash, faPenToSquare , faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const ProductDetails = () => {
  const { code } = useParams();  // החזרת הפרמטר שמופיע בכתובת, אחר כך נשתמש בזה בפונקציות הבאות בשביל להביא את המוצר עם המזהה
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:3000/products/code/${code}`); //מביא את פרטי הפריט 
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Error getting product", err);
      }
    };

    if (code) fetchProduct();
  }, [code]);

  if (!product) return <p className={styles.loading}>Loading product...</p>;

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    toast.success("It's in your cart");
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`http://localhost:3000/products/delete/${code}`, { // מוחק את הפריט - רק למי שאדמין
        method: "DELETE",
        credentials: "include"
      });
      if (res.ok) {
        navigate("/products");
      } else {
        console.error("Error deleting product");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className={styles.container}>
     
      <div className={styles.detailsCard}>
        <Link to='/products'> <FontAwesomeIcon icon={faArrowLeft}/></Link>
        <img src={product.imageUrl} alt={product.name} className={styles.image} />

        <div className={styles.info}>
          <h2 className={styles.title}>{product.name}</h2>
          <p><strong>Price:</strong> {product.price} $</p>
          <p><strong>Details:</strong> {product.description}</p>
          <p><strong>Category:</strong> {product.category}</p>
          <p><strong>Stock:</strong> {product.stock}</p>

          {product.stock > 0 ? (
            <button className={styles.addBtn} onClick={handleAddToCart}>
              <FontAwesomeIcon icon={faCartPlus} /> Add to cart
            </button>
          ) : (
            <button className={styles.disabledBtn} disabled>
              No stock
            </button>
          )}

          {user?.role === "admin" && (
            <div className={styles.adminActions}>
              <h3 className={styles.adminTitle}>Admin Actions</h3>
                <div className={styles.adminButtons}>
                  <button
                    className={styles.updateBtn}
                    onClick={() => navigate(`/products/update/${product.productCode}`)}
                  >
                    <FontAwesomeIcon icon={faPenToSquare} /> Update product
                  </button>
                  <button className={styles.deleteBtn} onClick={handleDelete}>
                    <FontAwesomeIcon icon={faTrash} /> Delete product
                  </button>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;