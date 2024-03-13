import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Profile.css';

function Profile() {
    const [userPhoto, setUserPhoto] = useState(null); // Изначальное состояние для фотографии пользователя
    const fileInputRef = useRef(null);

    // Допустим, что данные пользователя захардкожены для этого примера
    const userProfile = {
        name: 'Софья',
        phoneNumber: '+7(909)054-48-27',
        email: 'bazuevasd@gmail.com'
    };

    // Обработчик для изменения фотографии пользователя
    const handlePhotoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setUserPhoto(e.target.result); // Обновляем состояние фото пользователя
            };
            reader.readAsDataURL(file); // Читаем файл как Data URL
        }
    };

    // Вызывается при клике на кнопку
    const handleClick = () => {
        fileInputRef.current.click(); // Имитируем клик на скрытый input type="file"
    };

    return (
        <div className="profile-page">
            <h1>BeautyAI</h1>
            <div className="profile-links">
                <Link to="/">Главная</Link>
                <Link to="/history">История</Link>
                <Link to="/profile">Профиль</Link>
            </div>
            <div className="profile-content">
                <div className="user-info">
                    <div className="user-details">
                        <h2>Софья</h2>
                        <p><strong>Номер телефона:</strong>+7(909)054-48-27</p>
                        <p><strong>Email:</strong> bazuevasd@gmail.com</p>
                    </div>
                    <div className="user-photo">
                        {userPhoto && <img src={userPhoto} alt="Фото профиля" />}
                        
                        <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handlePhotoChange} />
                    </div>
                    
                </div>
            </div>
            <button className="photo-button" onClick={handleClick}>Добавить или изменить фото</button>
            <div className="profile-actions">
                <button className="button-settings">Настройки</button>
                <button className="button-booking">Бронирование</button>
                <button className="button-favorites">Избранное</button>
            </div>
            <div className="feedback">
                <h2>Обратная связь</h2>
                <p>+7(909)-054-48-27</p>
            </div>
        </div>
    );
}

export default Profile;




