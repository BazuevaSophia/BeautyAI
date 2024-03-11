import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
    return (
        <div className="homepage">
            <div className="top-right">
                <Link to="/registration">Регистрация</Link>
                <Link to="/authorization">Вход</Link>
            </div>
            <h1>BeautyAI</h1>
            <div className="main-links">
                <Link to="/">Главная</Link>
                <Link to="/history">История</Link>
                <Link to="/profile">Профиль</Link>
            </div>
            <nav className="other-links">
                <ul>
                    <li className="link-item link-beauty-booth"><Link to="/beauty-booth">Beauty кабинка</Link></li>
                    <li className="link-item link-makeup-artists"><Link to="/makeup-artists">Визажисты</Link></li>
                    <li className="link-item link-fresh-trends"><Link to="/fresh-trends">Fresh тренды</Link></li>
                    <li className="link-item link-artist-rating"><Link to="/artist-ratings">Рейтинг визажистов</Link></li>
                    <li className="link-item link-reviews"><Link to="/reviews">Отзывы</Link></li>
                </ul>
            </nav>
            <img src="Star.png" alt="STAR" className="star-image" />
        </div>
    );
}

export default HomePage;