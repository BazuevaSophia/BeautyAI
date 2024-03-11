import React from 'react';
import { Link } from 'react-router-dom';
import './Profile.css';

function Profile() {
    return (
        <div className="profile-page">
            <h1>BeautyAI</h1>
            <div className="profile-links">
                <Link to="/">Главная</Link>
                <Link to="/history">История</Link>
                <Link to="/profile">Профиль</Link>
            </div>
        </div>
    );
}

export default Profile;




