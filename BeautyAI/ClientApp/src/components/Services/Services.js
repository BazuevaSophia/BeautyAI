import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './Services.css';

function Services() {
    const { artistId } = useParams();
    const [services, setServices] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const apiUrl = process.env.REACT_APP_API_URL || 'https://localhost:7125';
        fetch(`${apiUrl}/api/artists/${artistId}/services`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => setServices(data))
            .catch(error => console.error('Ошибка при загрузке данных услуг:', error));
    }, [artistId]);

    const handleSignUpClick = (serviceId) => {
        navigate(`/sign-up/${artistId}/${serviceId}`);
    };

    return (
        <div className="services-page">
            <h1>BeautyAI</h1>
            <div className="services-links">
                <Link to="/">Главная</Link>
                <Link to="/history">История</Link>
                <Link to="/profile">Профиль</Link>
            </div>
            <button className="back-button" onClick={() => navigate(-1)}>Назад</button>
            <div className="services">
                {services.map((service, index) => (
                    <div key={index} className="service">
                        <h2>{service.name}</h2>
                        <img src={service.photo} alt={service.name} />
                        <p>{service.description}</p>
                        <div className="details">
                            <p>Цена: {service.price} ₽</p>
                            <p>Продолжительность: {service.duration}</p>
                        </div>
                        <button className="buttonServ" onClick={() => handleSignUpClick(service.serviceId)}>Записаться</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Services;