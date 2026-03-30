import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { getProducts } from "../services/api";
import { type Product } from "../types/Product";
import ProductCard from "./ProductCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Loading from "./Loading";

const NewArrivalsCarousel: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const data = await getProducts({ sort: "newest", limit: 15 });
        setProducts(data);
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  const settings = {
    dots: false,
    infinite: products.length > 4,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1280, // laptops
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 1024, // tablets landscape
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768, // tablets
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 640, // large mobile
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480, // small mobile
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  if (loading) return <Loading />;
  if (products.length === 0) return null;

  return (
    <section className="py-12 px-4 sm:px-8 bg-background overflow-hidden">
      <div className="container-custom mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-black text-white mb-2">
              New Arrivals
            </h2>
            <p className="text-text-secondary">
              Check out our latest collection of premium kids wear
            </p>
          </div>
        </div>

        <div className="mx-[-10px]">
          <Slider {...settings}>
            {products.map((product) => (
              <div key={product._id} className="px-[10px] h-full">
                <ProductCard product={product} />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default NewArrivalsCarousel;
