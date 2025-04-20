import { Carousel } from 'antd';
import { useNavigate } from 'react-router-dom';
import carouselData from '../../data/authCarousel.json';
import './RegisterIllustration.css';

const AuthCarousel = () => {
  const navigate = useNavigate();

  return (
    <div className="hidden lg:block w-1/2 min-h-screen bg-gradient-to-br from-[#1677ff] to-[#4096ff] relative overflow-hidden">
      <div className="absolute inset-0 bg-[#1677ff] opacity-10"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full max-w-lg px-8">
          <Carousel autoplay className="text-white">
            {carouselData.items.map((item, index) => (
              <div key={index} className="py-12">
                <div className="text-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full max-w-md mx-auto mb-8 drop-shadow-xl"
                  />
                  <h3 className="text-3xl font-bold mb-4 text-white drop-shadow-md">
                    {item.title}
                  </h3>
                  <p className="text-lg text-white/90 leading-relaxed drop-shadow-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
      <div className="absolute bottom-8 right-8">
        <button
          onClick={() => navigate("/login")}
          className="text-white hover:text-white/80 transition-colors text-sm font-medium"
        >
          Giriş Yap
        </button>
      </div>
    </div>
  );
};

export default AuthCarousel; 