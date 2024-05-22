import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import './Portfolio.css';

function Portfolio() {
    const { artistId } = useParams();
    const [portfolio, setPortfolio] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (artistId) {
            const apiUrl = process.env.REACT_APP_API_URL || 'https://localhost:7125';
            fetch(`${apiUrl}/api/portfolio/${artistId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => setPortfolio(data))
                .catch(error => console.error('Ошибка при загрузке портфолио:', error));
        }
    }, [artistId]);

    if (!portfolio) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className="portfolio-page">
            <h1>BeautyAI</h1>
            <div className="portfolio-links">
                <Link to="/">Главная</Link>
                <Link to="/history">История</Link>
                <Link to="/profile">Профиль</Link>
            </div>
            <div className="portfolio-content">
                <div className="artist-info">
                    <img src={portfolio.photo} alt="Визажист" className="artist-photo" />
                    <p className="artist-description">{portfolio.persDescription}</p>
                </div>
                <div className="portfolio-photos">
                    {portfolio.portfolioPhotos.map((photo, index) => (
                        <img key={index} src={photo} alt={`Работа ${index + 1}`} className="portfolio-photo" />
                    ))}
                </div>
                <button className="back-button" onClick={() => navigate(-1)}>Назад</button>
            </div>
        </div>
    );
}

export default Portfolio;