import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './MakeupArtists.css';

function MakeupArtists() {
    const [artists, setArtists] = useState([]);

    useEffect(() => {
        // Используйте полный URL если ваш front-end и API сервер размещены по разным адресам
        const apiUrl = process.env.REACT_APP_API_URL || ''; // URL вашего API, если требуется
        fetch(`${apiUrl}/makeup-artists/all-artists`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => setArtists(data))
            .catch(error => console.error('Ошибка при загрузке данных артистов:', error));
    }, []);

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
