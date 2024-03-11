import React from 'react';
import { Link } from 'react-router-dom';
import './History.css';

function History() {
    return (
        <div className="history-page">
            <h1>BeautyAI</h1>
            <div className="history-links">
                <Link to="/">Главная</Link>
                <Link to="/history">История</Link>
                <Link to="/profile">Профиль</Link>
            </div>
        </div>
    );
}

export default History;



