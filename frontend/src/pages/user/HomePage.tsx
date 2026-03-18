import ProductList from "./ProductList";
import Slider from "react-slick";
import cover01 from "../../assets/coverImages/kids-own-01.jpg";
import cover02 from "../../assets/coverImages/kids-own-02.jpg";
import cover03 from "../../assets/coverImages/kids-own-03.jpg";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative overflow-hidden">
        <SlickComponent />
      </section>
      <ProductList />
    </div>
  );
};

export default HomePage;

const SlickComponent = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    fade: true,
    arrows: true,
    cssEase: "linear",
  };

  const slides = [
    {
      id: 1,
      image: cover01,
      title: "New Summer Collection",
      subtitle: "Up to 50% Off on all kids wear",
    },
    {
      id: 2,
      image: cover02,
      title: "Playful Prints",
      subtitle: "Comfortable and stylish for active kids",
    },
    {
      id: 3,
      image: cover03,
      title: "Special Occasion Wear",
      subtitle: "Elegant styles for every celebration",
    },
  ];

  return (
    <div className="w-full">
      <Slider {...settings}>
        {slides.map((slide) => (
          <div key={slide.id} className="relative h-[400px] md:h-[600px]">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-white p-6">
              <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-center drop-shadow-lg">
                {slide.title}
              </h1>
              <p className="text-lg md:text-2xl font-medium mb-8 text-center drop-shadow-md">
                {slide.subtitle}
              </p>
              <button className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105 shadow-xl">
                Shop Now
              </button>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};
