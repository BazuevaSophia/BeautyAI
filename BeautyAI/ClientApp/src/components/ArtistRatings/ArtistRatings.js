import React from 'react';
import { Link } from 'react-router-dom';
import './ArtistRatings.css';

function ArtistRatings() {
    return (
        <div className="artist-ratings-page">
            <h1>BeautyAI</h1>
            <div className="artist-ratings-links">
                <Link to="/">Главная</Link>
                <Link to="/history">История</Link>
                <Link to="/profile">Профиль</Link>
            </div>
        </div>
    );
}

export default ArtistRatings;


