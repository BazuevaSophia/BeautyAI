import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Authorization.css';

function Authorization() {
    const [formData, setFormData] = useState({
        phone: '',
        password: '',
        showPassword: false,
    });
    const navigate = useNavigate();
    const location = useLocation();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phone') {
            const formattedPhone = formatPhoneNumber(value);
            setFormData({ ...formData, phone: formattedPhone });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const formatPhoneNumber = (value) => {
        const cleaned = ('' + value).replace(/\D/g, '').substring(0, 11);
        const match = cleaned.match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
        let formatted = '+7';
        if (match[2]) {
            formatted += `(${match[2]}`;
            if (match[3]) {
                formatted += `)${match[3]}`;
                if (match[4]) {
                    formatted += `-${match[4]}`;
                    if (match[5]) {
                        formatted += `-${match[5]}`;
                    }
                }
            }
        }
        return formatted;
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
                const redirectUrl = location.state?.from || '/';
                navigate(redirectUrl);
            } else {
                const errorData = await response.json();
                alert(errorData.message);
            }
        } catch (error) {
            alert("Ошибка сети при попытке входа");
        }
    };

    const toggleShowPassword = () => {
        setFormData({ ...formData, showPassword: !formData.showPassword });
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
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group password-input-wrapper">
                    <input
                        type={formData.showPassword ? "text" : "password"}
                        name="password"
                        className="input"
                        placeholder="Пароль"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <button type="button" className="toggle-password" onClick={toggleShowPassword}>
                        <img src={formData.showPassword ? "hide-eye.png" : "show-eye.png"} alt="Показать пароль" />
                    </button>
                </div>
                <button type="submit" className="submit-button">Вход</button>
            </form>
        </div>
    );
}

export default Authorization;
