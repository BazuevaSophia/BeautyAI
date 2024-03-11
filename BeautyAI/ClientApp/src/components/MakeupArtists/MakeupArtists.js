import React from 'react';
import { Link } from 'react-router-dom';
import './MakeupArtists.css';

function MakeupArtists() {
    return (
        <div className="makeup-artists-page">
            <h1>BeautyAI</h1>
            <div className="makeup-artists-links">
                <Link to="/">Главная</Link>
                <Link to="/history">История</Link>
                <Link to="/profile">Профиль</Link>
            </div>
        </div>
    );
}

export default MakeupArtists;
