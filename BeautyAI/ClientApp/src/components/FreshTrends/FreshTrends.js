import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './FreshTrends.css';

function TrendCarousel({ photos, description, trendId, onAddToFavorites }) {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    const nextPhoto = () => {
        setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
    };

    const prevPhoto = () => {
        setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
    };

    return (
        <div className="trend">
            <div className="trend-photos">
                <button onClick={prevPhoto}>&lt;</button>
                <img src={photos[currentPhotoIndex]} alt="Trend photo" />
                <button onClick={nextPhoto}>&gt;</button>
            </div>
            <div className="trend-dots">
                {photos.map((_, index) => (
                    <span
                        key={index}
                        className={`dot ${index === currentPhotoIndex ? 'active' : ''}`}
                    ></span>
                ))}
            </div>
            <p className="trend-description">{description}</p>
            <button className="favorite-button" onClick={() => onAddToFavorites(trendId)}>
                ❤️ Добавить в избранное
            </button>
        </div>
    );
}

function FreshTrends() {
    const [trends, setTrends] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterYear, setFilterYear] = useState('');
    const [filterSeason, setFilterSeason] = useState('');

    useEffect(() => {
        const fetchTrends = async () => {
            try {
                const response = await fetch('https://localhost:7125/api/trends/all-trends', {
                    credentials: 'include'
                });
                const result = await response.json();
                if (Array.isArray(result)) {
                    setTrends(result);
                } else {
                    console.error('Unexpected response format:', result);
                    setTrends([]);
                }
            } catch (error) {
                console.error('Ошибка при загрузке трендов: ', error);
                setTrends([]);
            }
        };

        fetchTrends();
    }, []);

    const handleAddToFavorites = async (trendId) => {
        try {
            const response = await fetch(`https://localhost:7125/api/trends/add-to-favorites?trendId=${trendId}`, {
                method: 'POST',
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            console.log('Trend added to favorites');
        } catch (error) {
            console.error('Ошибка при добавлении тренда в избранное: ', error);
        }
    };

    const handleSearch = () => {
        // Логика фильтрации трендов по введённым параметрам
    };

    return (
        <div className="fresh-trends-page">
            <h1>BeautyAI</h1>
            <div className="fresh-trends-links">
                <Link to="/">Главная</Link>
                <Link to="/history">История</Link>
                <Link to="/profile">Профиль</Link>
            </div>
            <div className="search-filter">
                <input
                    type="text"
                    placeholder="Поиск по названию"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                >
                    <option value="">Год</option>
                    {[...Array(8)].map((_, index) => {
                        const year = 2017 + index;
                        return <option key={year} value={year}>{year}</option>;
                    })}
                </select>
                <select
                    value={filterSeason}
                    onChange={(e) => setFilterSeason(e.target.value)}
                >
                    <option value="">Сезон</option>
                    <option value="Весна">Весна</option>
                    <option value="Лето">Лето</option>
                    <option value="Осень">Осень</option>
                    <option value="Зима">Зима</option>
                </select>
                <button onClick={handleSearch}>Поиск</button>
            </div>
            {trends.map((trend, index) => (
                <TrendCarousel
                    key={index}
                    photos={trend.photo}
                    description={trend.description}
                    trendId={trend.trendId}
                    onAddToFavorites={handleAddToFavorites}
                />
            ))}
        </div>
    );
}

export default FreshTrends;
