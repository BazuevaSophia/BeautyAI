import React, { useState } from 'react';
import './Registration.css';

function Registration() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',

    });
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Проверяем, совпадают ли пароли
        if (formData.password !== formData.confirmPassword) {
            alert("Пароли не совпадают.");
            return;
        }

        // Создаем объект для отправки на сервер, включаем поле "role"
        const userData = {
            ...formData,
            role: "Клиент" // Добавляем роль "Клиент" для всех зарегистрированных пользователей
        };

        try {
            const response = await fetch('http://localhost:44476/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Регистрация успешна:", data);
                // Вы можете перенаправить пользователя на другую страницу или показать сообщение об успешной регистрации
            } else {
                const errorData = await response.json();
                console.error("Ошибка регистрации:", errorData);
                // Показываем сообщение об ошибке
            }
        } catch (error) {
            console.error("Ошибка сети:", error);
        }
    };

    return (
        <div className="registration-page">
            <h1>BeautyAI</h1>
            <form onSubmit={handleSubmit} className="registration-form">
                <div className="form-group">
                    <label className="label"></label>
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
                    <label className="label"></label>
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
                    <label className="label"></label>
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
                    <label className="label"></label>
                    <input
                        type="password"
                        name="password"
                        className="input"
                        placeholder="Пароль" 
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label className="label"></label>
                    <input
                        type="password"
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
