import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/navbar.jsx";
import "../css/booking.css";

function Booked() {
    const [bookedRooms, setBookedRooms] = useState([]);

    useEffect(() => {
        const fetchBooked = async () => {
            try {
                const response = await axios.get("https://681f76f472e59f922ef6578f.mockapi.io/booked");
                setBookedRooms(response.data);
            } catch (err) {
                console.error("Произошла ошибка!", err)
            }
        };

        fetchBooked();
    }, []);

    const handleDelete = async (id) => {
        const roomToReturn = bookedRooms.find(room => room.id === id);
        if (!roomToReturn) return;

        try {
            await axios.post("https://6815245932debfe95dbafa1d.mockapi.io/rooms", {
                name: roomToReturn.name,
                photo: roomToReturn.photo,
                description: roomToReturn.description,
                city: roomToReturn.city,
                country: roomToReturn.country,
                checkIn: roomToReturn.checkIn,
                price: roomToReturn.price,
                rating: roomToReturn.rating,
                amenities: roomToReturn.amenities,
            });

            await axios.delete(`https://681f76f472e59f922ef6578f.mockapi.io/booked/${id}`);
            setBookedRooms(prev => prev.filter(room => room.id !== id));
        } catch (error) {
            console.error("Ошибка при удалении:", error);
            alert("Не удалось отменить бронирование.");
        }
    };

    return (
        <div>
            <Navbar />
            <div className="booked-container">
                <h1>Забронированные комнаты</h1>
                {bookedRooms.length === 0 ? (
                    <p>Пока нет забронированных комнат.</p>
                ) : (
                    <div className="booked-list">
                        {bookedRooms.map((room) => (
                            <div className="booked-card" key={room.id}>
                                <img src={room.photo} alt={room.name} className="booked-image" />
                                <div className="booked-info">
                                    <h3>{room.name}</h3>
                                    <p>{room.description}</p>
                                    <p><strong>Город:</strong> {room.city}</p>
                                    <p><strong>Дата заезда:</strong> {room.checkIn}</p>
                                    <p><strong>Цена:</strong> ${room.price}/night   </p>
                                    <button onClick={() => handleDelete(room.id)}>Удалить</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Booked;
