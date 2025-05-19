import { useState } from 'react';
import '../css/authorization.css';
import Embel from '../img/embel.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/authoContext';
import { auth } from '../firebase/firebase';
import { GoogleAuthProvider, GithubAuthProvider ,signInWithPopup} from 'firebase/auth';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const googleprovaider = new GoogleAuthProvider();
    const githubprovaider = new GithubAuthProvider();


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
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
        }
    };

    const handleGitHubLogin = async () => {
        try{
            const result = await signInWithPopup(auth, githubprovaider);
            const user = result.user;

            const newUser = {
                name: user.displayName,
                email: user.email,
                uid: user.uid
            }

            const checkResponse = await axios.get('https://6815245932debfe95dbafa1d.mockapi.io/users');
            const existingUsers = checkResponse.data.filter(u => u.uid === newUser.uid);

            if(existingUsers.length === 0){
                const saveResponse = await axios.post('https://6815245932debfe95dbafa1d.mockapi.io/users', newUser);
                console.log('Пользователь сохранён:', saveResponse.data);
                setUser(saveResponse.data);
            }else{
                console.log('Пользователь уже существует, вход выполнен');
                setUser(existingUsers[0]);
            }

            navigate('/');
        }catch(error){
            console.error('Ошибка при работе с API:', error);
            alert('Ошибка при сохранении данных пользователя');
        }
    }

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleprovaider);
            const user = result.user;

            const newUser = {
                name: user.displayName,
                email: user.email,
                uid: user.uid
            }

            const checkResponse = await axios.get('https://6815245932debfe95dbafa1d.mockapi.io/users');
            const existingUsers = checkResponse.data.filter(u => u.email === newUser.email);

            if (existingUsers.length === 0) {
                const saveResponse = await axios.post('https://6815245932debfe95dbafa1d.mockapi.io/users', newUser);
                console.log('Пользователь сохранён:', saveResponse.data);
                setUser(saveResponse.data);
            } else {
                console.log('Пользователь уже существует, вход выполнен');
                setUser(existingUsers[0]);
            }

            navigate('/');
        } catch (error) {
            console.error('Ошибка входа через Google или API:', error);
            alert('Ошибка входа через Google');
        }
    }

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

                    <button className='btn1' type="submit">Вход</button>
                </form>
                <br />
                <a href="/signUp">Зарегистрироваться</a>
                <br />
                <br />
                <p className='p1'>ИЛИ</p>
                <button className='btn1' onClick={handleGoogleLogin}>
                    Войти через Google
                </button>
                <br />
                <button className='btn1' onClick={handleGitHubLogin}>
                    Войти через GitHub
                </button>
            </div>
        </div>
    );
}

export default Login;