import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyCalendar.css';

function MyCalendar() {
    const [userData, setUserData] = useState({ artistId: null });
    const [selectedTimes, setSelectedTimes] = useState({});
    const [confirmedTimes, setConfirmedTimes] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
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
                await clearOldSignUps(result.artistId);
            } catch (error) {
                alert('Ошибка при загрузке данных пользователя');
            }
        };

        const fetchConfirmedTimes = async () => {
            try {
                const response = await fetch('https://localhost:7125/api/schedule/confirmed', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                if (response.ok) {
                    const result = await response.json();
                    setConfirmedTimes(result);
                } else {
                    throw new Error('Ошибка при загрузке подтвержденных времен');
                }
            } catch (error) {
                alert(error.message);
            }
        };

        const initTimes = {};
        getWeekDates().forEach(date => {
            initTimes[formatDate(date)] = [];
        });
        setSelectedTimes(initTimes);

        fetchUserData();
        fetchConfirmedTimes();
    }, []);

    const clearOldSignUps = async (artistId) => {
        try {
            const response = await fetch(`https://localhost:7125/api/artists/${artistId}/clear-old-signups`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Ошибка при очистке устаревших записей');
            }
            console.log('Устаревшие записи успешно удалены');
        } catch (error) {
            console.error(error.message);
        }
    };


    const getWeekDates = () => {
        const weekDates = [];
        const today = new Date();
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            weekDates.push(date);
        }
        return weekDates;
    };

    const formatDate = (date) => {
        const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
        const day = days[date.getDay()];
        const dayNum = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${dayNum}.${month} (${day})`;
    };

    const getTimes = () => {
        const times = [];
        for (let hour = 8; hour < 19; hour += 1.5) {
            const h = Math.floor(hour);
            const m = (hour % 1.5 === 0) ? '00' : '30';
            times.push(`${h}:${m}`);
        }
        return times;
    };

    const toggleTimeSelection = (date, time) => {
        const formattedDate = formatDate(date);
        const times = selectedTimes[formattedDate] || [];
        if (times.includes(time)) {
            setSelectedTimes({
                ...selectedTimes,
                [formattedDate]: times.filter(t => t !== time)
            });
        } else {
            setSelectedTimes({
                ...selectedTimes,
                [formattedDate]: [...times, time]
            });
        }
    };

    const handleConfirm = async (date) => {
        const formattedDate = formatDate(date);
        const selectedForDate = selectedTimes[formattedDate] || [];
        try {
            const response = await fetch('https://localhost:7125/api/schedule/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    dayOfWeek: formattedDate,
                    times: selectedForDate,
                    artistId: userData.artistId
                }),
            });
            if (!response.ok) {
                throw new Error('Ошибка при отправке данных');
            }
            alert('Время успешно сохранено!');
            setConfirmedTimes({
                ...confirmedTimes,
                [formattedDate]: [...(confirmedTimes[formattedDate] || []), ...selectedForDate]
            });

            setSelectedTimes({
                ...selectedTimes,
                [formattedDate]: []
            });
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="my-calendar-page">
            <h1>BeautyAI</h1>
            <div className="calendar-container">
                {getWeekDates().map((date, index) => {
                    const formattedDateForLoop = formatDate(date);
                    const isTopRow = index < 4;
                    return (
                        <div key={date} className={`calendar-day ${isTopRow ? 'top-row' : 'bottom-row'}`}>
                            <h2 className="day-heading">{formattedDateForLoop}</h2>
                            <div className="time-buttons">
                                {getTimes().map(time => (
                                    !confirmedTimes[formattedDateForLoop]?.includes(time) && (
                                        <button
                                            key={time}
                                            className={`time-button ${selectedTimes[formattedDateForLoop]?.includes(time) ? 'selected' : ''}`}
                                            onClick={() => toggleTimeSelection(date, time)}
                                        >
                                            {time}
                                        </button>
                                    )
                                ))}
                            </div>
                            <button className="confirm-button" onClick={() => handleConfirm(date)}>
                                Выбрать
                            </button>
                            {confirmedTimes[formattedDateForLoop] && confirmedTimes[formattedDateForLoop].length > 0 && (
                                <div className="confirmed-times">
                                    <h3>Выбранное время:</h3>
                                    <ul>
                                        {confirmedTimes[formattedDateForLoop].map(time => (
                                            <li key={time}>{time}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            <button className="bck-buttn" onClick={() => navigate(-1)}>Назад</button>
        </div>
    );
}

export default MyCalendar;


