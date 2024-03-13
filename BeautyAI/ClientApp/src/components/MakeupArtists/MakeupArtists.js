import React from 'react';
import { Link } from 'react-router-dom';
import './MakeupArtists.css'; 

function MakeupArtists() {
    const artists = [
        { name: 'София', image: 'art1.jpg' },
        { name: 'Мария', image: 'art2.jpg' },
        { name: 'Анастасия', image: 'art3.jpg' },
        { name: 'Надежда', image: 'art4.jpg' },
    ];

    return (
        <div className="makeup-artists-page">
            <h1>BeautyAI</h1>
            <div className="makeup-artists-links">
                <Link to="/">Главная</Link>
                <Link to="/history">История</Link>
                <Link to="/profile">Профиль</Link>
            </div>
            <div className="artists">
                {artists.map((artist, index) => (
                    <div key={index} className="artist">
                        <img src={artist.image} alt={artist.name} />
                        <h2>{artist.name}</h2>
                        <div className="buttons">
                            <button>Записаться</button>
                            <button>Портфолио</button>
                        </div>
                        <button className="middle-button">Отзывы</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MakeupArtists;
