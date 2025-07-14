import ProductCard from "./ProductCard";
import type { Product } from "../types/Product";


type Props = {
  title: string;
  products: Product[];
};

const CategorySection = ({ title, products }: Props) => {
  if (!products.length) return null;

  return (
    <section>
      <h2>{title}</h2>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
