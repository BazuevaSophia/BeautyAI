import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Authorization.css';

function Authorization() {
    const [formData, setFormData] = useState({
        phone: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('https://localhost:7125/api/authorization/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                navigate('/profile');
            } else {
                const errorData = await response.json();
                alert(errorData.message);
            }
        } catch (error) {
            alert("Ошибка сети при попытке входа");
        }
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
