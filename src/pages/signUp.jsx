import { useState } from 'react';
import Embel from '../img/embel.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/authoContext';

function SignUp() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: ''
    });
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                'https://6815245932debfe95dbafa1d.mockapi.io/users',
                formData
            );
            console.log('Успешная регистрация:', response.data);
            if (response.data) {
                login(response.data); 
                navigate('/login');
            }
        } catch (error) {
            console.error('Ошибка регистрации:', error);
            alert('Ошибка при регистрации');
        }
    };

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
                    />
                    <br /><br />

                    <button className='btn1' type="submit">Регистрация</button>
                </form>
                <br />
                <a href="/login">Уже есть аккаунт</a>
            </div>
        </div>
    )

}

export default SignUp;
