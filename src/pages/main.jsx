import '../css/main.css';
import Navbar from "../components/navbar";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../components/card';

function Main() {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useState({
        location: '',
        checkIn: '',
        date: '',
        rooms: ''
    });

    useEffect(() => {
        fetchHotels();
    }, []);

    const fetchHotels = async (params = {}) => {
        try {
            setLoading(true);
            const response = await axios.get(
                'https://6815245932debfe95dbafa1d.mockapi.io/rooms',
                { params }
            );
            console.log(response.data)
            setHotels(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchHotels({
            city: searchParams.location,
            checkIn: searchParams.checkIn,
            date: searchParams.date,
            rooms: searchParams.rooms
        });
    };

    const handleInputChange = ({ target: { name, value } }) => {
        setSearchParams(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className='main-container'>
            <Navbar />

            <div className='hero-section'>
                <div className='hero-content'>
                    <h1 className='hero-title'>Найдите жилье для новой поездки</h1>
                    <p className='hero-subtitle'>Ищите спецпредложения на отели, дома и другие варианты</p>
                </div>

                <form className='search-section' onSubmit={handleSearch}>
                    <input 
                        className='search-input' 
                        type="text" 
                        name="location"
                        placeholder='Куда вы хотите поехать?'
                        value={searchParams.location}
                        onChange={handleInputChange}
                    />
                    <input 
                        className='search-input date-input' 
                        type="date" 
                        name="checkIn"
                        value={searchParams.checkIn}
                        onChange={handleInputChange}
                    />
                    <input 
                        className='search-input' 
                        type="number" 
                        name="guests"
                        placeholder='Количество комнат'
                        value={searchParams.guests}
                        onChange={handleInputChange}
                        min="1"
                    />
                    <button type="submit" className='search-button'>Поиск</button>
                </form>
            </div>

            <div className="hotels-container">
                {loading && <div className="loading">Загрузка...</div>}
                {error && <div className="error">Ошибка: {error}</div>}
                {!loading && !error && hotels.length > 0 && (
                    hotels.map(hotel => (
                        <Card key={hotel.id} hotel={hotel} />
                    ))
                )}
                {!loading && !error && hotels.length === 0 && (
                    <div className="no-results">Ничего не найдено. Попробуйте изменить параметры поиска.</div>
                )}
            </div>
        </div>
    );
}

export default Main;
