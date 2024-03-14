import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './FreshTrends.css';


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
            description: 'В этом сезоне, для обладательниц карих глаз, извесен модный тренд на синий цет. Это могут быть самые разные макияжи: полностью синие тени, стрелки, либо блестки с синим оттенком.',
        },
        {
            photos: ['photo4.jpg', 'photo5.jpg', 'photo6.jpg'],
            description: 'Каким же этой весной будет трендовый макияж? Весна 2024 несет с собой нежные оттенки теней. Легкий румянец и нюдовые блески для губ. все просто))',
        },
        {
            photos: ['photo7.jpg', 'photo8.jpg', 'photo9.jpg'],
            description: 'Вау!! самаыми трендовыми губами будут те на которых издалека сияет шиммер, влажный эффект, а также вкусный красный!! ',
        },
        
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
