import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ReviewArt.css';

function ReviewArt() {
    const navigate = useNavigate();

    return (
        <div className="review-art-page">
            <h1>BeautyAI</h1>
            <div className="review-art-links">
                <Link to="/">Главная</Link>
                <Link to="/history">История</Link>
                <Link to="/profile">Профиль</Link>
            </div>
            <button className="back-button" onClick={() => navigate(-1)}>Назад</button>
        </div>
    );
}
export default ReviewArt;

