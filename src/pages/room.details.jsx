import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from '../components/navbar.jsx';
import axios from "axios";
import "../css/details.css";
import { useAuth } from "../components/authoContext.jsx";
import Modal from "../components/modal.jsx"; 

function Details() {
    const { id } = useParams();
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);

    const navigate = useNavigate();
    const { user } = useAuth();

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

    const handleOpenModal = () => {
        if (!user) {
            alert("Пожалуйста, войдите в систему для бронирования.");
            navigate("/login");
            return;
        }
        setModalOpen(true);
    };

    const handleBooking = async ({ rentername, checkIn, checkOut }) => {
        if (!rentername || !checkIn || !checkOut) {
            alert("Пожалуйста, заполните все поля.");
            return;
        }

        try {
            const bookingData = {
                ...hotel,
                renterName: rentername,
                checkIn,
                checkOut
            };

            await axios.post("https://681f76f472e59f922ef6578f.mockapi.io/booked", bookingData);
            await axios.delete(`https://6815245932debfe95dbafa1d.mockapi.io/rooms/${id}`);
            alert("Комната успешно забронирована!");
            navigate("/booking");
        } catch (error) {
            console.error("Ошибка при бронировании:", error);
            alert("Произошла ошибка при бронировании.");
        }
    };

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>{`Ошибка: ${error}`}</div>;
    if (!hotel || !hotel.name) return <div>Информация о отеле не доступна.</div>;

    return (
        <div>
            <Navbar />
            <div className="details-container">
                <button className="book-button" onClick={handleOpenModal}>
                    Забронировать
                </button>

                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setModalOpen(false)}
                    onSubmit={handleBooking}
                />

                <h1 className="text-center nameHotel">{hotel.name}</h1>
                <img className="hotels-image" src={hotel.photo} alt={hotel.name} />
                <p className="hotels-description">{hotel.description}</p>

                <div className="hotel-info">
                    <p><strong>Местоположение:</strong> {hotel.city}, {hotel.country}</p>
                    <p><strong>Дата заезда:</strong> доступно</p>
                    <p><strong>Дата выезда:</strong> доступно</p>
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
            </div>
        </div>
    );
}

export default Details;
