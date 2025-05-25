import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "../css/bookedDetails.css";
import Navbar from "../components/navbar";

function BookedDetails() {
  const { id } = useParams();
  const [booked, setBooked] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookedData = async () => {
      try {
        const response = await axios.get(`https://681f76f472e59f922ef6578f.mockapi.io/booked/${id}`);
        setBooked(response.data);
      } catch (err) {
        console.error("Не удалось загрузить данные бронирования", err);
        setError("Ошибка при загрузке данных.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookedData();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`https://681f76f472e59f922ef6578f.mockapi.io/booked/${id}`);
      alert("Бронирование успешно удалено.");
      window.location.href = "/booking";
    } catch (error) {
      console.error("Ошибка при удалении:", error);
      alert("Не удалось отменить бронирование.");
    }
  };


  if (loading) return <p className="loading">Загрузка...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!booked) return <p className="not-found">Данные о бронировании не найдены.</p>;

  const formatDate = (iso) => new Date(iso).toLocaleDateString("ru-RU", {
    year: "numeric", month: "long", day: "numeric"
  });

  return (
    <div>
      <Navbar />
      <Link to={'/booking'}><button className="btn-back">Назад</button></Link>
      <div className="booked-details-container">
        <h2>Детали бронирования</h2>
        <img src={booked.photo} alt={booked.name} className="booked-photo" />

        <div className="booked-info">
          <p><strong>Забронированно:</strong> {formatDate(booked.createdAt)}</p>
          <p><strong>Название:</strong> {booked.name}</p>
          <p><strong>Город:</strong> {booked.city}, {booked.country}</p>
          <p><strong>Дата заезда:</strong> {formatDate(booked.checkIn)}</p>
          <p><strong>Дата выезда:</strong> {formatDate(booked.checkOut)}</p>
          <p><strong>Количество комнат:</strong> {booked.rooms}</p>
          <p><strong>Цена:</strong> ${booked.price}</p>
          <p><strong>Рейтинг:</strong> {booked.rating} ⭐</p>
          <p><strong>Описание:</strong> {booked.description}</p>
          <p><strong>Имя арендатора:</strong> {booked.renterName}</p>

          <div>
            <strong>Удобства:</strong>
            <ul>
              {booked.amenities?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          <button className="deleteBtn" onClick={handleDelete}>Удалить</button>
        </div>
      </div>
    </div>
  );
}

export default BookedDetails;
