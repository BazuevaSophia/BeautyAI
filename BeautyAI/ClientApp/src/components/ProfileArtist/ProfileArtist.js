import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './ProfileArtist.css';

function ProfileArtist() {
    const [userData, setUserData] = useState({ name: '', phone: '', photo: '' });
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('https://localhost:7125/api/profileArtist/getProfile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                const result = await response.json();
                setUserData(result);
                setIsLoading(false);
            } catch (error) {
                alert('Ошибка при загрузке профиля');
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
                navigate('/');
            } else {
                alert('Ошибка при выходе из системы');
            }
        } catch (error) {
            alert('Ошибка сети при попытке выхода');
        }
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('photo', file);

            try {
                const response = await fetch('https://localhost:7125/api/profileArtist/uploadPhoto', {
                    method: 'POST',
                    credentials: 'include',
                    body: formData,
                });

                if (response.ok) {
                    const result = await response.json();
                    setUserData({ ...userData, photo: result.photo });
                } else {
                    alert('Ошибка при загрузке фото');
                }
            } catch (error) {
                alert('Ошибка сети при попытке загрузки фото');
            }
        }
    };

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className="profile-page">
            <h1>BeautyAI</h1>
            <div className="profile-content">
                <div className="user-info">
                    <div className="user-photo">
                        {userData.photo ? (
                            <img src={userData.photo} alt="Фото профиля" />
                        ) : (
                            <p>Фото отсутствует</p>
                        )}
                    </div>
                    <div className="user-details">
                        <h2>{userData.name}</h2>
                        <p><strong>Номер телефона:</strong> {userData.phone}</p>
                    </div>
                </div>
            </div>
            <div className="photo-upload">
                <input type="file" id="photoInput" style={{ display: 'none' }} onChange={handlePhotoUpload} />
                <button className="photo-button" onClick={() => document.getElementById('photoInput').click()}>Добавить или изменить фото</button>
            </div>
            <div className="profile-actions">
                <Link to="/setting" className="button-settings">Настройки</Link>
                <Link to="/reservations" className="button-booking">Бронирования</Link>
                <Link to="/favorites" className="button-favorites">Избранное</Link>
            </div>
            <button onClick={handleLogout} className="logout-button">Выйти</button>
            <div className="feedback">
                <h2>Обратная связь</h2>
                <p>+7(909)-054-48-27</p>
            </div>
        </div>
    );
}

export default ProfileArtist;
