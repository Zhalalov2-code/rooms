import { useState } from 'react';
import '../css/authorization.css';
import Embel from '../img/embel.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/authoContext';
import { auth, googleProvider, githubProvider } from '../firebase/firebase';
import { signInWithEmailAndPassword, signInWithPopup, setPersistence, browserLocalPersistence } from 'firebase/auth';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await setPersistence(auth, browserLocalPersistence);
      const result = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const firebaseUser = result.user;

      const response = await axios.get(
        `https://6815245932debfe95dbafa1d.mockapi.io/users?uid=${firebaseUser.uid}`
      );

      if (response.data.length > 0) {
        setUser(firebaseUser);
        navigate('/');
      } else {
        alert('Профиль не найден в базе.');
      }
    } catch (error) {
      console.error('Ошибка входа:', error);
      alert('Неверный email или пароль');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider) => {
    setLoading(true);
    try {
      await setPersistence(auth, browserLocalPersistence);
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      const checkResponse = await axios.get(
        `https://6815245932debfe95dbafa1d.mockapi.io/users?uid=${firebaseUser.uid}`
      );

      if (checkResponse.data.length === 0) {
        const newUser = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          avatar: firebaseUser.photoURL || 'https://i.pravatar.cc/100'
        };

        await axios.post(
          'https://6815245932debfe95dbafa1d.mockapi.io/users',
          newUser
        );
      }

      setUser(firebaseUser);
      navigate('/');
    } catch (error) {
      console.error('OAuth ошибка:', error);
      alert('Ошибка при входе через Google/GitHub');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="blok1">
        <img className='embel1' src={Embel} alt="" />
        <br /><br />
        <form onSubmit={handleLogin}>
          <label>Электронная почта:</label><br />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className='input1'
          /><br /><br />

          <label>Пароль:</label><br />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className='input1'
          /><br /><br />

          <button className='btn1' type="submit" disabled={loading}>
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <br />
        <a href="/signUp">Зарегистрироваться</a>
        <br /><br />

        <p className='p1'>ИЛИ</p>

        <button className='btn1' disabled={loading} onClick={() => handleOAuthLogin(googleProvider)}>
          Войти через Google
        </button>
        <br />
        <button className='btn1' disabled={loading} onClick={() => handleOAuthLogin(githubProvider)}>
          Войти через GitHub
        </button>
      </div>
    </div>
  );
}

export default Login;
