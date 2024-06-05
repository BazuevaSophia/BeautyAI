import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import './SignUp.css';

function SignUp() {
    const [signUps, setSignUps] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { artistId, serviceId } = useParams();
    const navigate = useNavigate();
    const { state } = useLocation();
    const [user, setUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

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

    const handleTimeClick = async (signUpId, dayOfWeek, time) => {
        if (!user) {
            console.error('User is not logged in');
            navigate('/authorization', { state: { from: window.location.pathname } });
            return;
        }

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

        const apiUrl = process.env.REACT_APP_API_URL || 'https://localhost:7125';

        try {
            let response;
            if (state && state.bookingId) {
                console.log('Updating booking with ID:', state.bookingId);
                response = await fetch(`${apiUrl}/api/bookings/${state.bookingId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(bookingData)
                });

                if (response.status === 204) {
                    console.log('Booking updated successfully with ID:', state.bookingId);
                    setModalMessage(`Вы успешно изменили услугу на ${dayOfWeek} в ${time}. Управлять записью вы можете в своем профиле, перейдя по кнопке "Бронирования".`);
                    setShowModal(true);
                    return;
                }
            } else {
                console.log('Creating new booking');
                response = await fetch(`${apiUrl}/api/bookings`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(bookingData)
                });
            }

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data);
            }

            console.log('Booking created/updated successfully:', data);
            setModalMessage(`Вы успешно ${state && state.bookingId ? 'изменили' : 'записались на'} услугу "${data.serviceName}" на ${data.date} в ${data.time}. Управлять записью вы можете в своем профиле, перейдя по кнопке "Бронирования".`);
            setShowModal(true);
        } catch (error) {
            console.error('Ошибка при создании/изменении бронирования:', error);
            setModalMessage('Произошла ошибка при создании/изменении бронирования. Пожалуйста, попробуйте снова.');
            setShowModal(true);
        }
    };


    const closeModal = () => {
        setShowModal(false);
        navigate('/');
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
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <p>{modalMessage}</p>
                        <button onClick={closeModal}>OK</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SignUp;
