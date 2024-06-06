import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Setting.css';

function Setting() {
    const [userData, setUserData] = useState({ name: '', email: '', phone: '', photo: '' });
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
                        navigate('/authorization', { state: { from: window.location.pathname } });
                        return;
                    } else {
                        throw new Error('Failed to fetch profile data');
                    }
                }

                const result = await response.json();
                setUserData(result);
                setIsLoading(false);
            } catch (error) {
                console.error('Ошибка при загрузке данных профиля: ', error);
                navigate('/authorization', { state: { from: window.location.pathname } });
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleUpdate = async (field, value) => {
        const updatedData = { ...userData, [field]: value };

        if (field === 'newPassword' && newPassword !== confirmPassword) {
            alert('Новый пароль и подтверждение пароля не совпадают.');
            return;
        }

        if (field === 'newPassword' && !validatePassword(newPassword)) {
            alert("Пароль должен содержать не менее 8 символов, включая цифры, латинские буквы и как минимум один специальный символ (*, @, #, и т.д.).");
            return;
        }

        if (field === 'email' && !validateEmail(updatedData.email)) {
            alert("Некорректный формат email.");
            return;
        }

        if (field === 'phone' && updatedData.phone.replace(/\D/g, '').length !== 11) {
            alert("Номер телефона должен содержать ровно 11 цифр.");
            return;
        }

        try {
            const response = await fetch('https://localhost:7125/api/profile/updateProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(updatedData),
            });

            if (response.ok) {
                alert('Вы успешно изменили свои личные данные.');
                const result = await response.json();
                setUserData(result);
                if (field === 'newPassword') {
                    setOldPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                }
                navigate('/profile');
            } else {
                const errorData = await response.json();
                alert(`Ошибка: ${errorData.message}`);
            }
        } catch (error) {
            alert('Ошибка сети при попытке обновления данных');
        }
    };

    const toggleShowOldPassword = () => setShowOldPassword(!showOldPassword);
    const toggleShowNewPassword = () => setShowNewPassword(!showNewPassword);
    const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phone') {
            const formattedPhone = formatPhoneNumber(value);
            setUserData({ ...userData, phone: formattedPhone });
        } else {
            setUserData({ ...userData, [name]: value });
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

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className="settings-page">
            <h1>BeautyAI</h1>
            <div className="settings-links">
                <Link to="/">Главная</Link>
                <Link to="/history">История</Link>
                <Link to="/profile">Профиль</Link>
            </div>
            
            <div className="settings-forms">
                <form className="settings-form" onSubmit={(e) => { e.preventDefault(); handleUpdate('phone', userData.phone); }}>
                    <div className="settings-form-group">
                        <label>Телефон</label>
                        <input
                            type="tel"
                            name="phone"
                            value={userData.phone}
                            onChange={handleChange}
                            className="settings-input"
                        />
                    </div>
                    <button type="submit" className="save-btn">Сохранить телефон</button>
                </form>
                <form className="settings-form" onSubmit={(e) => { e.preventDefault(); handleUpdate('email', userData.email); }}>
                    <div className="settings-form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                            className="settings-input"
                        />
                    </div>
                    <button type="submit" className="save-btn">Сохранить email</button>
                </form>
                <form className="settings-form" onSubmit={(e) => { e.preventDefault(); handleUpdate('newPassword', newPassword); }}>
                    <div className="settings-form-group">
                        <label>Старый пароль</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showOldPassword ? "text" : "password"}
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="settings-input"
                            />
                            <button type="button" className="toggle-password-btn" onClick={toggleShowOldPassword}>
                                <img src={showOldPassword ? "hide-eye.png" : "show-eye.png"} alt="Показать пароль" />
                            </button>
                        </div>
                    </div>
                    <div className="settings-form-group">
                        <label>Новый пароль</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="settings-input"
                            />
                            <button type="button" className="toggle-password-btn" onClick={toggleShowNewPassword}>
                                <img src={showNewPassword ? "hide-eye.png" : "show-eye.png"} alt="Показать пароль" />
                            </button>
                        </div>
                        <small>Пароль должен содержать не менее 8 символов, включая цифры, латинские буквы и как минимум один специальный символ (*, @, #, и т.д.).</small>
                    </div>
                    <div className="settings-form-group">
                        <label>Подтвердите новый пароль</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="settings-input"
                            />
                            <button type="button" className="toggle-password-btn" onClick={toggleShowConfirmPassword}>
                                <img src={showConfirmPassword ? "hide-eye.png" : "show-eye.png"} alt="Показать пароль" />
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="save-btn">Сохранить пароль</button>
                </form>
                <button className="back-btn" onClick={() => navigate(-1)}>Назад</button>
            </div>
        </div>
    );
}

export default Setting;
