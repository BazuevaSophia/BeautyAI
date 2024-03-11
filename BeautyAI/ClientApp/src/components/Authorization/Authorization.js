import React, { useState } from 'react';
import './Authorization.css'; 

function Authorization() {
    const [formData, setFormData] = useState({
        phone: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Здесь должна быть логика отправки данных для авторизации
        console.log(formData);
    };

    return (
        <div className="authorization-page">
            <h1>BeautyAI</h1>
            <form onSubmit={handleSubmit} className="authorization-form">
                <div className="form-group">
                    <input
                        type="tel"
                        name="phone"
                        className="input"
                        placeholder="+7(___)___-__-__"
                        pattern="\+7\(\d{3}\)\d{3}-\d{2}-\d{2}"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        name="password"
                        className="input"
                        placeholder="Пароль"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className="submit-button">Вход</button>
            </form>
        </div>
    );
}

export default Authorization;

