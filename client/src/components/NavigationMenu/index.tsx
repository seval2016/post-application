import { 
  HomeOutlined, 
  ShoppingCartOutlined,
  FileTextOutlined,
  UserOutlined,
  BarChartOutlined,
  LogoutOutlined 
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';
import CustomBadge from './CustomBadge';
import '../../styles/components/NavigationMenu/NavigationMenu.css';

interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface NavigationMenuProps {
  cartItems: CartItem[];
}

const DesktopMenu = ({ cartItems }: { cartItems: CartItem[] }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="desktop-menu">
      <Link to="/" className="menu-item group">
        <HomeOutlined className="menu-icon group-hover:scale-110" />
        <span className="menu-text">Ana Sayfa</span>
      </Link>
      <Link to="/cart" className="menu-item group">
        <CustomBadge count={cartItems.length}>
          <ShoppingCartOutlined className="menu-icon group-hover:scale-110" />
        </CustomBadge>
        <span className="menu-text">Sepet</span>
      </Link>
      <Link to="/bills" className="menu-item group">
        <FileTextOutlined className="menu-icon group-hover:scale-110" />
        <span className="menu-text">Faturalar</span>
      </Link>
      <Link to="/customers" className="menu-item group">
        <UserOutlined className="menu-icon group-hover:scale-110" />
        <span className="menu-text">Müşteriler</span>
      </Link>
      <Link to="/statistics" className="menu-item group">
        <BarChartOutlined className="menu-icon group-hover:scale-110" />
        <span className="menu-text">İstatistikler</span>
      </Link>
      <button onClick={handleLogout} className="logout-button group">
        <LogoutOutlined className="menu-icon group-hover:scale-110" />
        <span className="menu-text">Çıkış</span>
      </button>
    </nav>
  );
};

const MobileMenu = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="mobile-menu">
      <div className="mobile-menu-container">
        <Link to="/" className="menu-item group">
          <HomeOutlined className="menu-icon group-hover:scale-110" />
          <span className="menu-text">Ana Sayfa</span>
        </Link>
        <Link to="/bills" className="menu-item group">
          <FileTextOutlined className="menu-icon group-hover:scale-110" />
          <span className="menu-text">Faturalar</span>
        </Link>
        <Link to="/customers" className="menu-item group">
          <UserOutlined className="menu-icon group-hover:scale-110" />
          <span className="menu-text">Müşteriler</span>
        </Link>
        <Link to="/statistics" className="menu-item group">
          <BarChartOutlined className="menu-icon group-hover:scale-110" />
          <span className="menu-text">İstatistikler</span>
        </Link>
        <button onClick={handleLogout} className="logout-button group">
          <LogoutOutlined className="menu-icon group-hover:scale-110" />
          <span className="menu-text">Çıkış</span>
        </button>
      </div>
    </nav>
  );
};

// Tüm navigasyon bileşenlerini içeren ana bileşen
const NavigationMenu = ({ cartItems }: NavigationMenuProps) => {
  return (
    <>
      <DesktopMenu cartItems={cartItems} />
      <MobileMenu />
    </>
  );
};

export default NavigationMenu; 