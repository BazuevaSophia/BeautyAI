import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyApplication.css';

function MyApplication() {
    const [bookings, setBookings] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await fetch('https://localhost:7125/api/mybooking', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                if (response.ok) {
                    const result = await response.json();
                    setBookings(result);
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Ошибка при загрузке бронирований');
                }
            } catch (error) {
                alert(error.message);
            }
        };

        fetchBookings();
    }, []);

    const completeBooking = async (bookingId) => {
        try {
            const response = await fetch(`https://localhost:7125/api/mybooking/complete/${bookingId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok) {
                setBookings(bookings.filter(booking => booking.bookingId !== bookingId));
                alert('Бронирование успешно завершено!');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка при завершении бронирования');
            }
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="my-application-page">
            <h1>BeautyAI</h1>
            <div className="bookings-container">
                {bookings.length > 0 ? (
                    bookings.map(booking => (
                        <div key={booking.bookingId} className="booking-container">
                            <div className="booking-card">
                                <p>Дата: {booking.date}</p>
                                <p>Время: {booking.time}</p>
                                <p>Клиент: {booking.userName}</p>
                                <p>Услуга: {booking.serviceName}</p>
                            </div>
                            <button className="complete-button" onClick={() => completeBooking(booking.bookingId)}>
                                Выполнена
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="no-bookings-message">Актуальных заявок пока нет</p>
                )}
            </div>
            <button className="bck-buttn" onClick={() => navigate(-1)}>Назад</button>
        </div>
    );
}

export default MyApplication;
