import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './ProfileArtist.css';

function ProfileArtist() {
    const [userData, setUserData] = useState({ name: '', phone: '', photo: '', rating: 0, persDescription: '' });
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [description, setDescription] = useState('');
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
                setDescription(result.persDescription); 
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

    const handleSaveDescription = async () => {
        try {
            const response = await fetch('https://localhost:7125/api/profileArtist/updateProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ persDescription: description })
            });

            if (response.ok) {
                alert('Описание успешно обновлено.');
                setIsEditingDescription(false);
            } else {
                alert('Ошибка при обновлении описания');
            }
        } catch (error) {
            alert('Ошибка сети при попытке обновления описания');
        }
    };

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className="new-profile-page">
            <h1>BeautyAI</h1>
            <div className="new-profile-content">
                <div className="new-user-info">
                    <div className="new-user-photo">
                        {userData.photo ? (
                            <img src={userData.photo} alt="Фото профиля" />
                        ) : (
                            <p>Фото отсутствует</p>
                        )}
                    </div>
                    <div className="new-user-details">
                        <h2>{`${userData.name} ${userData.surname}`}</h2>
                        <p><strong>Номер телефона:</strong> <span className="new-phone-number">{userData.phone}</span></p>
                        <div className="new-user-rating">
                            <strong>Рейтинг:</strong>
                            {Array.from({ length: userData.rating }).map((_, index) => (
                                <span key={index} className="star">★</span>
                            ))}
                        </div>
                        <div className="new-user-description">
                            <strong>Описание:</strong>
                            {isEditingDescription ? (
                                <div>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                    <button onClick={handleSaveDescription}>Сохранить</button>
                                </div>
                            ) : (
                                <div>
                                    <p>{userData.persDescription}</p>
                                    <button onClick={() => setIsEditingDescription(true)}>Редактировать</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <button onClick={handleLogout} className="new-logout-button">Выйти</button>
            <div className="new-profile-actions">
                <button className="new-photo-button" onClick={() => document.getElementById('photoInput').click()}>Добавить или изменить фото</button>
                <Link to="/my-calendar" className="new-button-settings">Мое расписание</Link>
                <Link to="/my-application" className="new-button-booking">Мои заявки</Link>
                <Link to="/my-portfolio" className="new-button-favorites">Мое портфолио</Link>
                <Link to="/my-service" className="new-button-service">Мои услуги</Link>
            </div>
            <input type="file" id="photoInput" style={{ display: 'none' }} onChange={handlePhotoUpload} />
            <div className="new-feedback">
                <h2>Обратная связь</h2>
                <p>+7(909)-054-48-27</p>
            </div>
        </div>
    );
}

export default ProfileArtist;
