import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Registration.css';

function Registration() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        showPassword: false,
    });
    const navigate = useNavigate();

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
        const cleaned = value.replace(/\D/g, '').substring(0, 11);
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

        if (Object.values(formData).some(value => value === '')) {
            alert("Пожалуйста, заполните все поля.");
            return;
        }

        if (formData.phone.replace(/\D/g, '').length !== 11) {
            alert("Номер телефона должен содержать ровно 11 цифр.");
            return;
        }

        if (formData.name.trim() === '') {
            alert("Имя не может содержать только пробелы.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            alert("Пароли не совпадают.");
            return;
        }

        if (!validatePassword(formData.password)) {
            alert("Пароль должен содержать не менее 8 символов, включая цифры, латинские буквы и как минимум один специальный символ (*, @, #, и т.д.).");
            return;
        }

        const userData = {
            ...formData,
            role: "Клиент"
        };

        try {
            const response = await fetch('https://localhost:7125/api/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Регистрация успешна:", data);
                navigate('/Authorization');
            } else {
                const errorData = await response.json();
                console.error("Ошибка регистрации:", errorData);
            }
        } catch (error) {
            console.error("Ошибка сети:", error);
        }
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const toggleShowPassword = () => {
        setFormData({ ...formData, showPassword: !formData.showPassword });
    };

    return (
        <div className="registration-page">
            <h1>BeautyAI</h1>
            <form onSubmit={handleSubmit} className="registration-form">
                <div className="form-group">
                    <input
                        type="text"
                        name="name"
                        className="input"
                        placeholder="Имя"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        name="email"
                        className="input"
                        placeholder="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
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
                <div className="form-group password-input-wrapper">
                    <input
                        type={formData.showPassword ? "text" : "password"}
                        name="confirmPassword"
                        className="input"
                        placeholder="Повторите пароль"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className="submit-button">Регистрация</button>
            </form>
        </div>
    );
}

export default Registration;
