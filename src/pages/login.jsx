import { useState } from 'react';
import '../css/authorization.css';
import Embel from '../img/embel.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/authoContext';
import { auth } from '../firebase/firebase';
import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const googleProvider = new GoogleAuthProvider();
    const githubProvider = new GithubAuthProvider();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.get(
                'https://6815245932debfe95dbafa1d.mockapi.io/users'
            );

            const user = response.data.find(user =>
                user.email === formData.email &&
                user.password === formData.password
            );

            if (user) {
                setUser(user);
                navigate('/');
            } else {
                alert('Неверный email или пароль');
            }
        } catch (error) {
            console.error('Ошибка при входе:', error);
            alert('Ошибка сервера при входе');
        } finally {
            setLoading(false);
        }
    };

    const handleOAuthLogin = async (provider) => {
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const newUser = {
                name: user.displayName,
                email: user.email,
                uid: user.uid
            };

            const checkResponse = await axios.get('https://6815245932debfe95dbafa1d.mockapi.io/users');
            const existingUsers = checkResponse.data.filter(u => u.uid === newUser.uid);

            if (existingUsers.length === 0) {
                const saveResponse = await axios.post('https://6815245932debfe95dbafa1d.mockapi.io/users', newUser);
                setUser(saveResponse.data);
            } else {
                setUser(existingUsers[0]);
            }

            navigate('/');
        } catch (error) {
            console.error('Ошибка при OAuth-входе:', error);
            alert('Ошибка при входе через OAuth');
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
                    <label>Электронная почта:</label>
                    <br />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className='input1'
                    />
                    <br /><br />

                    <label>Пароль:</label>
                    <br />
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className='input1'
                    />
                    <br /><br />

                    <button className='btn1' type="submit" disabled={loading}>
                        {loading ? 'Вход...' : 'Вход'}
                    </button>
                </form>
                <br />
                <a href="/signUp">Зарегистрироваться</a>
                <br />
                <br />
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
