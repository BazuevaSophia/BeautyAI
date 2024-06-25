import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './History.css';

function History() {
    const [visits, setVisits] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('https://localhost:7125/api/profile/getProfile', {
                    withCredentials: true
                });
                setCurrentUser(response.data);
            } catch (error) {
                console.error('Ошибка при загрузке данных профиля:', error);
            }
        };

        fetchProfile();
    }, []);

    useEffect(() => {
        if (currentUser) {
            const fetchCompletedBookings = async () => {
                try {
                    const response = await axios.get(`https://localhost:7125/api/bookings/completed/user/${currentUser.userId}`);
                    setVisits(response.data);
                } catch (error) {
                    console.error('Ошибка при загрузке завершенных бронирований:', error);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchCompletedBookings();
        } else {
            setIsLoading(false);
        }
    }, [currentUser]);

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className="history-page">
            <h1>BeautyAI</h1>
            <div className="history-links">
                <Link to="/">Главная</Link>
                <Link to="/history">История</Link>
                <Link to="/profile">Профиль</Link>
            </div>
            {currentUser ? (
                <div className="visits">
                    {visits.length > 0 ? (
                        visits.map((visit, index) => (
                            <div key={index} className="visit">
                                <p>Описание: {visit.description}</p>
                                <p>Дата: {visit.date}</p>
                                <p>Время: {visit.time}</p>
                                <p>Мастер: {visit.master}</p>
                                <p>Длительность услуги: {visit.duration}</p>
                                <p>Цена: {visit.price}</p>
                            </div>
                        ))
                    ) : (
                        <p>Завершенных заявок пока нет.</p>
                    )}
                </div>
            ) : (
                <div className="not-authenticated-message">
                    <p>Для авторизованных пользователей здесь отображается список завершенных заявок.</p>
                </div>
            )}
        </div>
    );
}

export default History;
