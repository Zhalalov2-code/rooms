import { useState } from 'react';
import '../css/modal.css';

function Modal({ isOpen, onClose, onSubmit }) {
  const [rentername, setRenterName] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  const handleSubmit = () => {
    onSubmit({ rentername, checkIn, checkOut });
    setRenterName('');
    setCheckIn('');
    setCheckOut('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-window" onClick={e => e.stopPropagation()}>
        <h2>Бронирование комнаты</h2>
        <label>
          Имя арендатора:
          <input
            type="text"
            value={rentername}
            onChange={e => setRenterName(e.target.value)}
            placeholder="Введите имя"
          />
        </label>
        <label>
          Дата заезда:
          <input
            type="date"
            value={checkIn}
            onChange={e => setCheckIn(e.target.value)}
          />
        </label>
        <label>
          Дата выезда:
          <input
            type="date"
            value={checkOut}
            onChange={e => setCheckOut(e.target.value)}
          />
        </label>
        <div className="modal-buttons">
          <button className="btn cancel" onClick={onClose}>Отмена</button>
          <button
            className="btn submit"
            onClick={handleSubmit}
            disabled={!rentername || !checkIn || !checkOut}
          >
            Подтвердить
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
