import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Reservations.css';

function Reservations() {
    const [reservations, setReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState(null);
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
                    throw new Error('Failed to fetch profile');
                }

                const profile = await response.json();
                setUserId(profile.userId);
                fetchReservations(profile.userId);
            } catch (error) {
                console.error('Ошибка при загрузке профиля: ', error);
                setIsLoading(false);
            }
        };

        const fetchReservations = async (userId) => {
            try {
                const response = await fetch(`https://localhost:7125/api/bookings/user/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch bookings');
                }

                const result = await response.json();
                setReservations(result);
            } catch (error) {
                console.error('Ошибка при загрузке бронирований: ', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleCancel = async (bookingId) => {
        try {
            const response = await fetch(`https://localhost:7125/api/bookings/${bookingId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to cancel booking');
            }

            setReservations(reservations.filter(booking => booking.bookingId !== bookingId));
        } catch (error) {
            console.error('Ошибка при отмене бронирования: ', error);
        }
    };

    const handleEdit = (bookingId, artistId, serviceId) => {
        if (window.confirm('Хотите изменить дату или время?')) {
            navigate(`/sign-up/${artistId}/${serviceId}`, { state: { bookingId } });
        }
    };

    return (
        <div className="reservations-page">
            <h1>BeautyAI</h1>
            <div className="reservations-links">
                <Link to="/">Главная</Link>
                <Link to="/history">История</Link>
                <Link to="/profile">Профиль</Link>
            </div>
            <button className="back-button" onClick={() => navigate(-1)}>Назад</button>
            <div className="reservations-content">
                {isLoading ? (
                    <p>Загрузка...</p>
                ) : reservations.length > 0 ? (
                    reservations.map((booking) => (
                        <div key={booking.bookingId} className="booking-wrapper">
                            <div className="booking-card">
                                <h2>{booking.serviceName}</h2>
                                <p><strong>Дата:</strong> {booking.date}</p>
                                <p><strong>Время:</strong> {booking.time}</p>
                                <p><strong>Мастер:</strong> {booking.artistName}</p>
                                <p><strong>Длительность услуги:</strong> {booking.duration}</p>
                                <p><strong>Цена:</strong> {booking.price}Р</p>
                            </div>
                            <div className="booking-buttons">
                                <button className="booking-button" onClick={() => handleCancel(booking.bookingId)}>Отменить</button>
                                <button className="booking-button" onClick={() => handleEdit(booking.bookingId, booking.artistId, booking.serviceId)}>Изменить</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-reserv-message">Бронирований нет.</p>
                )}
            </div>
        </div>
    );
}

export default Reservations;
