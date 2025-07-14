import { Link } from "react-router-dom";
import type { Product } from "../types/Product";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/store";
import styles from "./ProductCard.module.css";
import toast from "react-hot-toast";


const ProductCard = ({ product }: { product: Product }) => {
  const dispatch = useDispatch();
  const isInStock = product.stock > 0;

  const handleAdd = () => {
    dispatch(addToCart(product));
    toast.success("It's in your cart");
  };

  return (
    <div className={styles.card}>
      <img src={product.imageUrl} alt={product.name} />
      <Link to={`/products/code/${product.productCode}`} className={styles.name}>
        <h3>{product.name}</h3>
      </Link>
      <span className={styles.price}>{product.price} $</span>
      {isInStock ? (
        <button onClick={handleAdd} className={styles.button}>Add to cart</button>
      ) : (
        <span className={styles.disabledButton}>No stock</span>
      )}
    </div>
  );
};

export default ProductCard;