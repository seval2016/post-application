import { 
  HomeOutlined, 
  ShoppingCartOutlined, 
  FileTextOutlined,
  UserOutlined,
  BarChartOutlined,
  LogoutOutlined 
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { logout } from '../../redux/authSlice';
import CustomBadge from './CustomBadge.tsx';

const DesktopMenu = () => {
  const { items } = useSelector((state: RootState) => state.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="hidden sm:flex items-center gap-8">
      <Link to="/" className="hover:text-blue-600 transition-all duration-300 ease-in-out flex flex-col items-center gap-1 group">
        <HomeOutlined className="text-lg transition-all duration-300 group-hover:scale-110" />
        <span className="text-xs">Ana Sayfa</span>
      </Link>
      <Link to="/cart" className="hover:text-blue-600 transition-all duration-300 ease-in-out flex flex-col items-center gap-1 group relative">
        <CustomBadge count={items.length}>
          <ShoppingCartOutlined style={{ fontSize: '24px' }} className="transition-all duration-300 group-hover:scale-110" />
        </CustomBadge>
        <span className="text-xs">Sepet</span>
      </Link>
      <Link to="/bills" className="hover:text-blue-600 transition-all duration-300 ease-in-out flex flex-col items-center gap-1 group">
        <FileTextOutlined className="text-lg transition-all duration-300 group-hover:scale-110" />
        <span className="text-xs">Faturalar</span>
      </Link>
      <Link to="/customers" className="hover:text-blue-600 transition-all duration-300 ease-in-out flex flex-col items-center gap-1 group">
        <UserOutlined className="text-lg transition-all duration-300 group-hover:scale-110" />
        <span className="text-xs">Müşteriler</span>
      </Link>
      <Link to="/statistics" className="hover:text-blue-600 transition-all duration-300 ease-in-out flex flex-col items-center gap-1 group">
        <BarChartOutlined className="text-lg transition-all duration-300 group-hover:scale-110" />
        <span className="text-xs">İstatistikler</span>
      </Link>
      <button onClick={handleLogout} className="hover:text-red-500 transition-all duration-300 ease-in-out flex flex-col items-center gap-1 group">
        <LogoutOutlined className="text-lg transition-all duration-300 group-hover:scale-110" />
        <span className="text-xs">Çıkış</span>
      </button>
    </nav>
  );
};

// Mobil görünümde header'ın sağ tarafında görünecek sepet ikonu
const MobileCartIcon = () => {
  const { items } = useSelector((state: RootState) => state.cart);
  
  return (
    <div className="sm:hidden">
      <Link to="/cart" className="hover:text-blue-600 transition-all duration-300 ease-in-out flex flex-col items-center gap-1 group relative">
        <CustomBadge count={items.length}>
          <ShoppingCartOutlined style={{ fontSize: '24px' }} className="transition-all duration-300 group-hover:scale-110" />
        </CustomBadge>
      </Link>
    </div>
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
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t py-2 sm:hidden z-50">
      <div className="flex items-center justify-around">
        <Link to="/" className="hover:text-blue-600 transition-all duration-300 ease-in-out flex flex-col items-center gap-1 group">
          <HomeOutlined className="text-lg transition-all duration-300 group-hover:scale-110" />
          <span className="text-xs">Ana Sayfa</span>
        </Link>
        <Link to="/bills" className="hover:text-blue-600 transition-all duration-300 ease-in-out flex flex-col items-center gap-1 group">
          <FileTextOutlined className="text-lg transition-all duration-300 group-hover:scale-110" />
          <span className="text-xs">Faturalar</span>
        </Link>
        <Link to="/customers" className="hover:text-blue-600 transition-all duration-300 ease-in-out flex flex-col items-center gap-1 group">
          <UserOutlined className="text-lg transition-all duration-300 group-hover:scale-110" />
          <span className="text-xs">Müşteriler</span>
        </Link>
        <Link to="/statistics" className="hover:text-blue-600 transition-all duration-300 ease-in-out flex flex-col items-center gap-1 group">
          <BarChartOutlined className="text-lg transition-all duration-300 group-hover:scale-110" />
          <span className="text-xs">İstatistikler</span>
        </Link>
        <button onClick={handleLogout} className="hover:text-red-500 transition-all duration-300 ease-in-out flex flex-col items-center gap-1 group">
          <LogoutOutlined className="text-lg transition-all duration-300 group-hover:scale-110" />
          <span className="text-xs">Çıkış</span>
        </button>
      </div>
    </nav>
  );
};

// Header için sadece sepet ikonunu gösteren bileşen
export const HeaderNavigation = () => {
  return (
    <>
      <DesktopMenu />
      <MobileCartIcon />
    </>
  );
};

// Alt menü için sadece mobil menüyü gösteren bileşen
export const BottomNavigation = () => {
  return <MobileMenu />;
};

// Tüm navigasyon bileşenlerini içeren ana bileşen
const NavigationMenu = () => {
  return (
    <>
      <DesktopMenu />
      <MobileCartIcon />
      <MobileMenu />
    </>
  );
};

export default NavigationMenu; 