import React from 'react';
import { Link } from 'react-router-dom';
import './Portfolio.css';

function Portfolio() {
    return (
        <div className="portfolio-page">
            <h1>BeautyAI</h1>
            <div className="portfolio-links">
                <Link to="/">Главная</Link>
                <Link to="/history">История</Link>
                <Link to="/profile">Профиль</Link>
            </div>
            
        </div>
    );
}

export default Portfolio;

