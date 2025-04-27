import { Link, useNavigate } from 'react-router-dom';
import {
  HomeOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  BarChartOutlined,
  LogoutOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/authSlice';
import CustomBadge from './CustomBadge';
import { selectCartItemsCount } from '../../redux/cartSlice';
import '../../styles/NavigationMenu/NavigationMenu.css';

const MobileMenu = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItemsCount = useSelector(selectCartItemsCount);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="mobile-menu-container">
      <nav className="mobile-menu">
        <Link to="/" className="menu-item">
          <HomeOutlined className="menu-icon" />
          <span className="menu-text">Ana Sayfa</span>
        </Link>
        <Link to="/cart" className="menu-item">
          <CustomBadge count={cartItemsCount}>
            <ShoppingCartOutlined className="menu-icon" />
          </CustomBadge>
          <span className="menu-text">Sepet</span>
        </Link>
        <Link to="/orders" className="menu-item">
          <ShoppingOutlined className="menu-icon" />
          <span className="menu-text">Siparişler</span>
        </Link>
        <Link to="/customers" className="menu-item">
          <UserOutlined className="menu-icon" />
          <span className="menu-text">Müşteriler</span>
        </Link>
        <Link to="/statistics" className="menu-item">
          <BarChartOutlined className="menu-icon" />
          <span className="menu-text">İstatistikler</span>
        </Link>
        <button onClick={handleLogout} className="logout-button">
          <LogoutOutlined className="menu-icon" />
          <span className="menu-text">Çıkış</span>
        </button>
      </nav>
    </div>
  );
};

export default MobileMenu; 