import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ArtistRatings.css';

function ArtistRatings() {
    const [artists, setArtists] = useState([]);

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const response = await axios.get('/api/artists/get-artist-ratings');
                setArtists(response.data);
            } catch (error) {
                console.error('Ошибка при загрузке рейтингов визажистов:', error);
            }
        };

        fetchArtists();
    }, []);

    const renderStars = (rating) => {
        let stars = [];
        for (let i = 0; i < rating; i++) {
            stars.push(<img key={i} src="Star.png" alt="Star" className="star" />);
        }
        return stars;
    };

    return (
        <div className="artist-ratings-page">
            <h1>BeautyAI</h1>
            <div className="artist-ratings-links">
                <Link to="/">Главная</Link>
                <Link to="/history">История</Link>
                <Link to="/profile">Профиль</Link>
            </div>
            <div className="artist-ratings-list">
                {artists.map((artist, index) => (
                    <div key={index} className="artist-rating">
                        <div className="artist-name">{artist.name}</div>
                        <div className="artist-stars">
                            {renderStars(artist.rating)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ArtistRatings;
