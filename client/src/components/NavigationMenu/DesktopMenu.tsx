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

const DesktopMenu = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItemsCount = useSelector(selectCartItemsCount);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="desktop-menu">
      <div className="desktop-menu-items">
        <Link to="/" className="menu-item group">
          <HomeOutlined className="menu-icon group-hover:scale-110" />
          <span className="menu-text">Ana Sayfa</span>
        </Link>
        <Link to="/cart" className="menu-item group">
          <CustomBadge count={cartItemsCount}>
            <ShoppingCartOutlined className="menu-icon group-hover:scale-110" />
          </CustomBadge>
          <span className="menu-text">Sepet</span>
        </Link>
        <Link to="/orders" className="menu-item group">
          <ShoppingOutlined className="menu-icon group-hover:scale-110" />
          <span className="menu-text">Siparişler</span>
        </Link>
        <Link to="/customers" className="menu-item group">
          <UserOutlined className="menu-icon group-hover:scale-110" />
          <span className="menu-text">Müşteriler</span>
        </Link>
        <Link to="/statistics" className="menu-item group">
          <BarChartOutlined className="menu-icon group-hover:scale-110" />
          <span className="menu-text">İstatistikler</span>
        </Link>
      </div>
      <button onClick={handleLogout} className="logout-button group">
        <LogoutOutlined className="menu-icon group-hover:scale-110" />
        <span className="menu-text">Çıkış</span>
      </button>
    </nav>
  );
};

export default DesktopMenu; 