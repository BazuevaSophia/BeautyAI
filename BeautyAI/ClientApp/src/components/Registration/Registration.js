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

      
        if (formData.password !== formData.confirmPassword) {
            alert("Пароли не совпадают.");
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
             
            } else {
                const errorData = await response.json();
                console.error("Ошибка регистрации:", errorData);
               
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
