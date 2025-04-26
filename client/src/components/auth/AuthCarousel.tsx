import { Carousel } from "antd";
import { Link } from "react-router-dom";
import '../../styles/auth/AuthCarousel.css';

const AuthCarousel = () => {
  return (
    <div className="carousel-container">
      <div className="carousel-overlay" />
      <div className="carousel-content">
        <div className="carousel-wrapper">
          <Carousel autoplay>
            <div className="carousel-slide">
              <div className="carousel-image-wrapper">
                <img
                  src="/images/auth/responsive.svg"
                  alt="responsive"
                  className="carousel-image"
                />
              </div>
              <h3 className="carousel-title">
                Responsive Tasarım
              </h3>
              <p className="carousel-description">
                Tüm cihaz boyutlarıyla uyumlu tasarım
              </p>
            </div>
            <div className="carousel-slide">
              <div className="carousel-image-wrapper">
                <img
                  src="/images/auth/statistic.svg"
                  alt="statistic"
                  className="carousel-image"
                />
              </div>
              <h3 className="carousel-title">
                İstatistikler
              </h3>
              <p className="carousel-description">
                Geniş tutulan istatistikler
              </p>
            </div>
            <div className="carousel-slide">
              <div className="carousel-image-wrapper">
                <img
                  src="/images/auth/customer.svg"
                  alt="customer"
                  className="carousel-image"
                />
              </div>
              <h3 className="carousel-title">
                Müşteri Memnuniyeti
              </h3>
              <p className="carousel-description">
                Deneyim sonunda üründen memnun müşteriler
              </p>
            </div>
            <div className="carousel-slide">
              <div className="carousel-image-wrapper">
                <img
                  src="/images/auth/admin.svg"
                  alt="admin"
                  className="carousel-image"
                />
              </div>
              <h3 className="carousel-title">
                Yönetici Paneli
              </h3>
              <p className="carousel-description">
                Tek yerden yönetim
              </p>
            </div>
          </Carousel>
        </div>
      </div>
      <Link to="/login" className="carousel-login-button">
        Giriş Yap
      </Link>
    </div>
  );
};

export default AuthCarousel; 