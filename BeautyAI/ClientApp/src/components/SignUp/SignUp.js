import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignUp.css';

function SignUp() {
    const navigate = useNavigate();

    return (
        <div className="sign-up-page">
            <h1>BeautyAI</h1>
            <div className="sign-up-links">
                <Link to="/">Главная</Link>
                <Link to="/history">История</Link>
                <Link to="/profile">Профиль</Link>
            </div>
            <button className="back-button" onClick={() => navigate(-1)}>Назад</button>
        </div>
    );
}
export default SignUp;
