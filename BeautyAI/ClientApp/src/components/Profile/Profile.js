import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

function Profile() {
    const [userData, setUserData] = useState({ name: '', email: '', phone: '', photo: [] });
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('https://localhost:7125/api/profile/getProfile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        window.location.href = '/Authorization';
                        return;
                    } else {
                        throw new Error('Failed to fetch profile data');
                    }
                }

                const result = await response.json();
                setUserData(result);
            } catch (error) {
                console.error('Ошибка при загрузке данных профиля: ', error);
                window.location.href = '/Authorization';
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            const response = await fetch('https://localhost:7125/api/authorization/logout', {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                alert('Вы успешно вышли из системы.');
                window.location.href = '/';
            } else {
                alert('Ошибка при выходе из системы');
            }
        } catch (error) {
            alert('Ошибка сети при попытке выхода');
        }
    };

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className="profile-page">
            <h1>BeautyAI</h1>
            <div className="profile-links">
                <a href="/">Главная</a>
                <a href="/history">История</a>
                <a href="/profile">Профиль</a>
            </div>
            <div className="profile-content">
                <div className="user-info">
                    <div className="user-photo">
                        {userData.photo.length > 0 && <img src={userData.photo[0]} alt="Фото профиля" />}
                    </div>
                    <div className="user-details">
                        <h2>{userData.name}</h2>
                        <p><strong>Номер телефона:</strong> {userData.phone}</p>
                        <p><strong>Email:</strong> {userData.email}</p>
                    </div>
                </div>
            </div>
            <button className="photo-button" onClick={() => alert('Загрузка фото не реализована')}>Добавить или изменить фото</button>
            <div className="profile-actions">
                <button className="button-settings">Настройки</button>
                <button className="button-booking">Бронирование</button>
                <button className="button-favorites">Избранное</button>
            </div>
            <button onClick={handleLogout} className="photo-button">Выйти</button>
            <div className="feedback">
                <h2>Обратная связь</h2>
                <p>+7(909)-054-48-27</p>
            </div>
        </div>
    );
}

export default Profile;
