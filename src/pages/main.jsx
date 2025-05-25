import '../css/main.css';
import Navbar from "../components/navbar";
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Card from '../components/card';
import 'react-datepicker/dist/react-datepicker.css';

function Main() {
  const [originalHotels, setOriginalHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams, setSearchParams] = useState({
    location: '',
    checkIn: null,
    checkOut: null
  });

  const [filters, setFilters] = useState({
    country: '',
    city: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    maxRating: '',
    minRooms: '',
    maxRooms: '',
    amenities: []
  });

  const allCountries = [...new Set(originalHotels.map(hotel => hotel.country))];
  const allCities = [...new Set(originalHotels.map(hotel => hotel.city))];
  const allAmenities = Array.from(
    new Set(originalHotels.flatMap(hotel => hotel.amenities))
  ).sort();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const filterBlock = document.getElementById('filterBlock');
      const filterPlaceholder = document.getElementById('filterPlaceholder');

      if (filterBlock && filterPlaceholder) {
        if (scrollY >= 350) {
          filterBlock.classList.add('fixed');
          filterPlaceholder.style.height = `${filterBlock.offsetHeight}px`;
        } else {
          filterBlock.classList.remove('fixed');
          filterPlaceholder.style.height = '0';
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    fetchHotels();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const fetchHotels = async (params = {}) => {
    try {
      setLoading(true);
      const response = await axios.get(
        'https://6815245932debfe95dbafa1d.mockapi.io/rooms',
        { params }
      );
      setOriginalHotels(response.data);
      setFilteredHotels(response.data);
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
      rooms: searchParams.checkOut
    });
  };

  const handleInputChange = ({ target: { name, value } }) => {
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFilters(prev => ({
        ...prev,
        amenities: checked
          ? [...prev.amenities, name]
          : prev.amenities.filter(a => a !== name)
      }));
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  const applyFilters = useCallback(() => {
    const filtered = originalHotels.filter(hotel => {
      if (filters.country && hotel.country !== filters.country) return false;
      if (filters.city && hotel.city !== filters.city) return false;
      if (filters.minPrice && hotel.price < Number(filters.minPrice)) return false;
      if (filters.maxPrice && hotel.price > Number(filters.maxPrice)) return false;
      if (filters.minRating && hotel.rating < Number(filters.minRating)) return false;
      if (filters.maxRating && hotel.rating > Number(filters.maxRating)) return false;
      if (filters.minRooms && Number(hotel.rooms) < Number(filters.minRooms)) return false;
      if (filters.maxRooms && Number(hotel.rooms) > Number(filters.maxRooms)) return false;

      if (filters.amenities.length > 0 &&
        !filters.amenities.every(a => hotel.amenities.includes(a))) {
        return false;
      }

      return true;
    });

    setFilteredHotels(filtered);
  }, [originalHotels, filters]);

  const resetFilters = () => {
    setFilters({
      country: '',
      city: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      maxRating: '',
      minRooms: '',
      maxRooms: '',
      amenities: []
    });
  };

  useEffect(() => {
    if (originalHotels.length > 0) {
      applyFilters();
    }
  }, [applyFilters, originalHotels]);

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
          <button type="submit" className='search-button'>Поиск</button>
        </form>
      </div>

      <div className='content-section'>
        <div className='filter-section'>
          <div id="filterPlaceholder" style={{ height: 0 }}></div>
          <div id='filterBlock' className='filter-block'>
            <div className="filter-content">
              <h5 className='text-filter'><b>Все фильтры:</b></h5>

              <div className="filter-group">
                <label><b>Страна:</b></label>
                <select
                  name="country"
                  value={filters.country}
                  onChange={handleFilterChange}
                >
                  <option value="">Все страны</option>
                  {allCountries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label><b>Город:</b></label>
                <select
                  name="city"
                  value={filters.city}
                  onChange={handleFilterChange}
                >
                  <option value="">Все города</option>
                  {allCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label><b>Цена за ночь:</b></label>
                <div className="price-range">
                  <input
                    type="number"
                    name="minPrice"
                    placeholder="От"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    name="maxPrice"
                    placeholder="До"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                  />
                </div>
              </div>

              <div className="filter-group">
                <label><b>Рейтинг:</b></label>
                <div className="rating-range">
                  <input
                    type="number"
                    name="minRating"
                    placeholder="От"
                    min="1"
                    max="5"
                    step="0.1"
                    value={filters.minRating}
                    onChange={handleFilterChange}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    name="maxRating"
                    placeholder="До"
                    min="1"
                    max="5"
                    step="0.1"
                    value={filters.maxRating}
                    onChange={handleFilterChange}
                  />
                </div>
              </div>

              <div className="filter-group">
                <label><b>Комнаты:</b></label>
                <div className="rooms-range">
                  <input
                    type="number"
                    name="minRooms"
                    placeholder="От"
                    min="1"
                    value={filters.minRooms}
                    onChange={handleFilterChange}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    name="maxRooms"
                    placeholder="До"
                    min="1"
                    value={filters.maxRooms}
                    onChange={handleFilterChange}
                  />
                </div>
              </div>

              <div className="filter-group amenities">
                <label><b>Удобства:</b></label>
                <div className="amenities-grid">
                  {allAmenities.map(amenity => (
                    <div key={amenity} className="amenity-item">
                      <input
                        type="checkbox"
                        id={amenity}
                        name={amenity}
                        checked={filters.amenities.includes(amenity)}
                        onChange={handleFilterChange}
                      />
                      <label htmlFor={amenity}>{amenity}</label>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={resetFilters} className="reset-button">
                Сбросить фильтры
              </button>
            </div>
          </div>
        </div>

        <div className="hotels-container">
          {loading && <div className="loading">Загрузка...</div>}
          {error && <div className="error">Ошибка: {error}</div>}
          {!loading && !error && filteredHotels.length > 0 ? (
            filteredHotels.map(hotel => (
              <Card key={hotel.id} hotel={hotel} />
            ))
          ) : (
            <div className="no-results">
              {!loading && "Ничего не найдено. Попробуйте изменить параметры поиска."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Main;