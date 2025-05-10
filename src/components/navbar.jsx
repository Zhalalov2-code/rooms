import { Link, useNavigate } from 'react-router-dom';
import '../css/navbar.css';
import Embel2 from '../img/embel2.png';
import { useAuth } from '../components/authoContext';

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="navbar">
            <div className="navbar-brand">
                <Link to="/">
                    <img src={Embel2} alt="Логотип" className="logo-img" />
                </Link>
            </div>

            <nav className="nav-menu">
                <Link to="/" className="nav-link">Главное</Link>
                <Link to="/booking" className="nav-link">Забронированные</Link>

                {user ? (
                    <>
                        <Link to="/profil" className="nav-link">Профиль</Link>
                        <button className="nav-link logout-btn" onClick={handleLogout}>
                            Выйти
                        </button>
                    </>
                ) : (
                    <Link to="/login" className="nav-link">Вход</Link>
                )}
            </nav>
        </header>
    );
}

export default Navbar;
