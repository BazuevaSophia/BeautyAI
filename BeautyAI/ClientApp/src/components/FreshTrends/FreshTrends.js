import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './FreshTrends.css'; // Убедитесь, что в этом файле описаны все необходимые стили


function TrendPhoto({ src }) {
    return (
        <div className="trend-photo-container">
            <img src={src} className="blurred" alt="Trend" />
            <img src={src} className="focused" alt="Trend" />
        </div>
    );
}
// Компонент для карусели одного тренда
function TrendCarousel({ photos, description }) {
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
        </div>
    );
}

function FreshTrends() {
    const trends = [
        {
            photos: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'],
            description: 'В этом сезоне среди главных модных мейкап...',
        },
        {
            photos: ['photo4.jpg', 'photo5.jpg', 'photo6.jpg'],
            description: 'Следующий тренд описывается здесь...',
        },
        {
            photos: ['photo7.jpg', 'photo8.jpg', 'photo9.jpg'],
            description: 'Текст для последнего тренда...',
        },
        // Можно добавить больше трендов
    ];

    return (
        <div className="fresh-trends-page">
            <h1>BeautyAI</h1>
            <div className="fresh-trends-links">
                <Link to="/">Главная</Link>
                <Link to="/history">История</Link>
                <Link to="/profile">Профиль</Link>
            </div>
            {trends.map((trend, index) => (
                <TrendCarousel key={index} photos={trend.photos} description={trend.description} />
            ))}
        </div>
    );
}

export default FreshTrends;
