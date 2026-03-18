import { type Product } from "../types/Product";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/product/${product?._id}`)}
      className="border border-[#e8e6e6] rounded-lg sm:shadow-md hover:shadow-lg transition flex flex-col min-h-[300px] cursor-pointer"
    >
      <img
        src={product?.images?.[0] as string}
        alt={product?.name}
        className="w-full h-48 object-cover rounded"
      />
      <div className="flex-1 flex flex-col justify-center p-3">
        <h3 className="text-lg font-semibold whitespace-nowrap truncate">
          {product?.name}
        </h3>
        <p>{product?.description}</p>
        <p className="text-gray-600">${product?.price.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default ProductCard;
