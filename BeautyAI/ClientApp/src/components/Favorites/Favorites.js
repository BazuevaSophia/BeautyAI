import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Favorites.css';

function TrendCarousel({ photos, description, trendId, onRemoveFromFavorites }) {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    const nextPhoto = () => {
        setCurrentPhotoIndex(prevIndex => (prevIndex + 1) % photos.length);
    };

    const prevPhoto = () => {
        setCurrentPhotoIndex(prevIndex => (prevIndex - 1 + photos.length) % photos.length);
    };

    const handleRemoveFromFavorites = async () => {
        try {
            await onRemoveFromFavorites(trendId);
        } catch (error) {
            console.error('Ошибка при удалении тренда из избранного: ', error);
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
                className="favorite-button"
                onClick={handleRemoveFromFavorites}
            >
                Убрать из избранного
            </button>

            <p className="trend-description">{description}</p>
        </div>
    );
}

function Favorites() {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await fetch('https://localhost:7125/api/trends/favorites', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch favorites');
                }

                const result = await response.json();
                setFavorites(result);
            } catch (error) {
                console.error('Ошибка при загрузке избранных трендов: ', error);
            }
        };

        fetchFavorites();
    }, []);

    const handleRemoveFromFavorites = async (trendId) => {
        try {
            const response = await fetch('https://localhost:7125/api/trends/remove-from-favorites', {
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
            setFavorites((prevFavorites) => prevFavorites.filter(trend => trend.trendId !== trendId));
            console.log('Trend removed from favorites');
        } catch (error) {
            console.error('Ошибка при удалении тренда из избранного: ', error);
        }
    };

    return (
        <div className="favorites-page">
            <h1>BeautyAI</h1>
            <div className="favorites-links">
                <Link to="/">Главная</Link>
                <Link to="/history">История</Link>
                <Link to="/profile">Профиль</Link>
            </div>
            <div className="favorites-content">
                {favorites.length > 0 ? (
                    favorites.map(trend => (
                        <TrendCarousel
                            key={trend.trendId}
                            photos={trend.photo}
                            description={trend.description}
                            trendId={trend.trendId}
                            onRemoveFromFavorites={handleRemoveFromFavorites}
                        />
                    ))
                ) : (
                    <>
                        <p className="no-favorites-message">Избранных трендов нет.</p>
                        <Link to="/fresh-trends" className="go-to-fresh-trends">
                            Перейти к свежим трендам
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}

export default Favorites;
