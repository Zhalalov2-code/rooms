import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from '../components/navbar.jsx'
import axios from "axios";
import "../css/details.css";

function Details() {
    const { id } = useParams();
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHotelData = async () => {
            try {
                const response = await axios.get(`https://6815245932debfe95dbafa1d.mockapi.io/rooms/${id}`);
                setHotel(response.data);
            } catch (err) {
                setError("Не удалось загрузить данные отеля");
            } finally {
                setLoading(false);
            }
        };

        fetchHotelData();
    }, [id]);

    const handleBooking = async () => {
        try {
            await axios.post("https://681f76f472e59f922ef6578f.mockapi.io/booked", hotel);
            await axios.delete(`https://6815245932debfe95dbafa1d.mockapi.io/rooms/${id}`);
            alert("Комната успешно забронирована!");
            navigate("/booking")
        } catch (error) {
            console.error("Ошибка при бронировании:", error);
            alert("Произошла ошибка при бронировании.");
        }
    }

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>{error}</div>;
    if (!hotel) return <div>Отель не найден</div>;

    return (
        <div>
            <Navbar />
            <div className="details-container">
                <h1>{hotel.name}</h1>
                <img className="hotels-image" src={hotel.photo} alt={hotel.name} />
                <p className="hotels-description">{hotel.description}</p>

                <div className="hotel-info">
                    <p><strong>Местоположение:</strong> {hotel.city}, {hotel.country}</p>
                    <p><strong>Дата заезда:</strong> {hotel.checkIn}</p>
                    <p><strong>Комнат доступно:</strong> {hotel.rooms}</p>
                </div>

                <div className="details-footer">
                    <span className="price">${hotel.price}/night</span>
                    <span className="rating">⭐ {hotel.rating}</span>
                </div>

                <div className="amenities">
                    <h3>Удобства:</h3>
                    <ul>
                        {hotel.amenities.map((item, index) => (
                            <li key={index}>✔ {item}</li>
                        ))}
                    </ul>
                </div>

               <button className="book-button" onClick={handleBooking}>Забронировать</button>
            </div>
        </div>
    );
}

export default Details;
