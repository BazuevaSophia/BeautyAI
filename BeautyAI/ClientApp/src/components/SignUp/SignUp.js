import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './SignUp.css';

function SignUp() {
    const [signUps, setSignUps] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { artistId, serviceId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

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
                setUser(result);
                console.log('User profile data:', result);
            } catch (error) {
                console.error('Ошибка при загрузке данных профиля: ', error);
                navigate('/authorization', { state: { from: window.location.pathname } });
            }
        };

        const fetchSignUps = async () => {
            const apiUrl = process.env.REACT_APP_API_URL || 'https://localhost:7125';
            try {
                const response = await fetch(`${apiUrl}/api/artists/${artistId}/signups`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setSignUps(data);
            } catch (error) {
                console.error('Ошибка при загрузке данных записей:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
        fetchSignUps();
    }, [artistId, navigate]);

    const handleTimeClick = (signUpId, dayOfWeek, time) => {
        if (!user) {
            console.error('User is not logged in');
            navigate('/authorization', { state: { from: window.location.pathname } });
            return;
        }

        const apiUrl = process.env.REACT_APP_API_URL || 'https://localhost:7125';
        const bookingData = {
            userId: user.userId,
            serviceId: parseInt(serviceId),
            artistId: parseInt(artistId),
            signUpId: signUpId,
            date: dayOfWeek,
            time: time,
            status: 'оформлен'
        };

        console.log('Booking Data being sent:', bookingData);

        fetch(`${apiUrl}/api/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        })
            .then(response => response.json().then(data => {
                if (!response.ok) {
                    console.error('Ошибка при создании бронирования:', data);
                    throw new Error(data);
                }
                return data;
            }))
            .then(data => {
                console.log('Booking created successfully:', data);
                navigate('/'); 
            })
            .catch(error => console.error('Ошибка при создании бронирования:', error));
    };


    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className="sign-up-page">
            <h1>BeautyAI</h1>
            <div className="sign-up-links">
                <Link to="/">Главная</Link>
                <Link to="/history">История</Link>
                <Link to="/profile">Профиль</Link>
            </div>
            <button className="back-button" onClick={() => navigate(-1)}>Назад</button>
            <div className="signups">
                {signUps.map((signUp, index) => (
                    <div key={index} className="day">
                        <h2>{signUp.dayOfWeek}</h2>
                        <div className="time-buttons">
                            {signUp.times.map((time, timeIndex) => (
                                <button
                                    key={timeIndex}
                                    className="time-button"
                                    onClick={() => handleTimeClick(signUp.signUpId, signUp.dayOfWeek, time)}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SignUp;
