import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './History.css';

function History() {
    const [visits, setVisits] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCompletedBookings = async () => {
            try {
                const response = await fetch('https://localhost:7125/api/bookings/completed');
                if (!response.ok) {
                    throw new Error('Ошибка при загрузке завершенных бронирований');
                }
                const data = await response.json();
                console.log('Completed bookings:', data);
                setVisits(data);
            } catch (error) {
                console.error(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCompletedBookings();
    }, []);

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
            <div className="visits">
                {visits.map((visit, index) => (
                    <div key={index} className="visit">
                        <p>Описание: {visit.description}</p>
                        <p>Дата: {visit.date}</p>
                        <p>Время: {visit.time}</p> 
                        <p>Мастер: {visit.master}</p>
                        <p>Длительность услуги: {visit.duration}</p>
                        <p>Цена: {visit.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default History;
