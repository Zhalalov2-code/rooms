import { useState } from 'react';
import Embel from '../img/embel.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/authoContext';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase/firebase';

function SignUp() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userCredintial = await createUserWithEmailAndPassword(
                auth, formData.email, formData.password
            );
            const firebaseUser = userCredintial.user;

            await updateProfile(firebaseUser, {
                displayName: formData.name
            });

            const profile = {
                uid: firebaseUser.uid,
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                avatar: 'https://i.pravatar.cc/100'
            };
            await axios.post('https://6815245932debfe95dbafa1d.mockapi.io/users', profile);
            setUser(firebaseUser);
            navigate('/');
        } catch (error) {
            console.error('Firebase Error:', error.code, error.message, error);

            if (error.code === 'auth/email-already-in-use') {
                alert('Этот email уже используется.');
            } else if (error.code === 'auth/invalid-email') {
                alert('Неверный формат email.');
            } else if (error.code === 'auth/weak-password') {
                alert('Пароль должен быть не менее 6 символов.');
            } else {
                alert('Неизвестная ошибка: ' + error.message);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='container'>
            <div className="blok1">
                <img className='embel1' src={Embel} alt="" />
                <br /><br />
                <form onSubmit={handleSubmit}>
                    <label>Имя:</label>
                    <br />
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className='input1'
                    />
                    <br /><br />

                    <label>Сотовый номер:</label>
                    <br />
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className='input1'
                    />
                    <br /><br />

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
                        {loading ? 'Регистрация...' : 'Регистрация'}
                    </button>
                </form>
                <br />
                <a href="/login">Уже есть аккаунт</a>
            </div>
        </div>
    );
}

export default SignUp;
