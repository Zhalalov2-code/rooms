import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/navbar';
import { useAuth } from '../components/authoContext';
import '../css/profil.css';

function Profil() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [editField, setEditField] = useState(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (!user?.uid) return;

    const fetchUser = async () => {
      try {
        const response = await axios.get(`https://6815245932debfe95dbafa1d.mockapi.io/users?uid=${user.uid}`);
        if(response.data.length > 0){
          setProfileData(response.data[0]);
        }else{
          console.warn('Пользователь с таким uid не найден в MockAPI');
        }
      } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error.message);
      }
    };

    fetchUser();
  }, [user?.uid]);

  if (!user) return <p>Пожалуйста, войдите в свою учетную запись для просмотра профиля.</p>;
  if (!profileData) return <p>Загрузка профиля...</p>;

  const handleEditClick = (field) => {
    setEditField(field);
    setInputValue(profileData[field] || '');
  };

  const handleSaveClick = async () => {
    if (!profileData || !editField) return;

    try {
      const updated = { ...profileData, [editField]: inputValue };
      const response = await axios.put(
        `https://6815245932debfe95dbafa1d.mockapi.io/users/${profileData.id}`,
        updated
      );
      setProfileData(response.data);
      setEditField(null); 
    } catch (err) {
      console.error('Ошибка при сохранении:', err.response?.data || err.message);
      alert('Ошибка при сохранении: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div>
      <Navbar />
      <div className="profile-container">
        <h1 className="title-profile">Ваш Профиль</h1>

        {['name', 'phone', 'avatar'].map((field) => (
          <div key={field}>
            <strong>
              {field === 'name' ? 'Имя' : field === 'phone' ? 'Сотовый номер' : 'Фото профиля'}:
            </strong>{' '}
            {editField === field ? (
              <>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <button className="buttonEdit" onClick={handleSaveClick}>ок</button>
                <button className="buttonEdit" onClick={() => setEditField(null)}>Отмена</button>
              </>
            ) : field === 'avatar' ? (
              <>
                {profileData.avatar ? (
                  <img
                    src={profileData.avatar}
                    alt="avatar"
                    width={50}
                    height={50}
                    style={{ borderRadius: '50%', verticalAlign: 'middle' }}
                  />
                ) : (
                  <span>Нет фото</span>
                )}{' '}
                <button className="edit-button1" onClick={() => handleEditClick('avatar')}>
                  Изменить
                </button>
              </>
            ) : (
              <>
                {profileData[field] || 'Не указано'}{' '}
                <button className="edit-button1" onClick={() => handleEditClick(field)}>Изменить</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profil;