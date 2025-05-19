import "../css/card.css";
import { Link } from "react-router-dom"

const Card = ({ hotel }) => {
  return (
    <div className="hotel-card">
      <div className="blok1">
        <img src={hotel.photo} alt={hotel.name} className="hotel-image" />
      </div>
      <div className="hotel-content">
        <h2 className="hotel-name">{hotel.name}</h2>
        <p className="hotel-location">
          {hotel.city}, {hotel.country} — Check-in: {hotel.checkIn}
        </p>
        <p className="hotel-description">{hotel.description}</p>
        <div className="hotel-amenities">
          {Array.isArray(hotel.amenities) && hotel.amenities.map((item, i) => (
            <span key={i} className="hotel-amenity">{item}</span>
          ))}
        </div>
      </div>
      <div className="hotel-footer">
        <span className="hotel-price">${hotel.price}/night</span>
        <br />
        <br />
        <span className="hotel-rating">Оценка ⭐ {hotel.rating}</span>
        <br />
        <br />
        <Link to={`/hotel/${hotel.id}`}><button>Подробнее</button></Link>
      </div>
    </div>
  );
};

export default Card;
