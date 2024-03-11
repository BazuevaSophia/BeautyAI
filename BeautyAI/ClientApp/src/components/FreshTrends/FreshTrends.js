import React from 'react';
import { Link } from 'react-router-dom';
import './FreshTrends.css';

function FreshTrends() {
    return (
        <div className="fresh-trends-page">
            <h1>BeautyAI</h1>
            <div className="fresh-trends-links">
                <Link to="/">Главная</Link>
                <Link to="/history">История</Link>
                <Link to="/profile">Профиль</Link>
            </div>
        </div>
    );
}

export default FreshTrends;

