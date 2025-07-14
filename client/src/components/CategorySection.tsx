import ProductCard from "./ProductCard";
import styles from "./CategorySection.module.css";
import type { Product } from "../types/Product";

interface Props {
  title: string;
  products: Product[];
}

const CategorySection = ({ title, products }: Props) => {
  return (
    <section className={styles.categorySection}>
      <h2 className={styles.categoryTitle}>{title}</h2>
      <div className={styles.productsRow}>
        {products.map((product) => (
          <ProductCard key={product.productCode} product={product} />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;