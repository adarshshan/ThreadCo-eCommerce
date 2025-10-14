import { type Product } from "../types/Product";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // const getImageUrl = (name: string) =>
  //   new URL(`../assets/testingImages/${name}`, import.meta.url).href;

  return (
    <div className="border border-[#e8e6e6] rounded-lg p-4 sm:shadow-md hover:shadow-lg transition flex flex-col min-h-[300px]">
      <img
        // src={getImageUrl(product.images?.[0] as string)}
        src={product.images?.[0] as string}
        alt={product.name}
        className="w-full h-48 object-cover rounded"
      />
      <div className="flex-1 flex flex-col justify-center">
        <h3 className="text-lg font-semibold mt-2 whitespace-nowrap truncate">
          {product.name}
        </h3>
        <p className="text-gray-600">${product.price.toFixed(2)}</p>
      </div>
      <Link
        to={`/product/${product?._id}`}
        className="mt-2 inline-block bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 text-center"
      >
        View Details
      </Link>
    </div>
  );
};

export default ProductCard;
