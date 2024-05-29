import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './FreshTrends.css';

function TrendCarousel({ photos, description, trendId, onAddToFavorites }) {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);

    const nextPhoto = () => {
        setCurrentPhotoIndex(prevIndex => (prevIndex + 1) % photos.length);
    };

    const prevPhoto = () => {
        setCurrentPhotoIndex(prevIndex => (prevIndex - 1 + photos.length) % photos.length);
    };

    const handleAddToFavorites = async () => {
        try {
            await onAddToFavorites(trendId);
            setIsFavorite(true);
        } catch (error) {
            console.error('Ошибка при добавлении тренда в избранное: ', error);
        }
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
                    <span key={index} className={`dot ${index === currentPhotoIndex ? 'active' : ''}`}></span>
                ))}
            </div>
            <button
                className={`favorite-button ${isFavorite ? 'favorite-button-active' : ''}`}
                onClick={handleAddToFavorites}
            >
                Добавить в избранное
            </button>
            
            <p className="trend-description">{description}</p>
        </div>
    );
}

function FreshTrends() {
    const [trends, setTrends] = useState([]);

    useEffect(() => {
        const fetchTrends = async () => {
            try {
                const response = await fetch('https://localhost:7125/api/trends/all-trends', {
                    credentials: 'include',
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
            const response = await fetch('https://localhost:7125/api/trends/add-to-favorites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ trendId }),
                credentials: 'include',
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Ошибка: ${errorData.message}`);
            }
            console.log('Trend added to favorites');
        } catch (error) {
            console.error('Ошибка при добавлении тренда в избранное: ', error);
            alert(`Ошибка при добавлении тренда в избранное: ${error.message}`);
            throw error;
        }
    };

    return (
        <div className="fresh-trends-page">
            <h1>BeautyAI</h1>
            <div className="fresh-trends-links">
                <Link to="/">Главная</Link>
                <Link to="/history">История</Link>
                <Link to="/profile">Профиль</Link>
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
