import React from 'react';
import { Link } from 'react-router-dom';
import './History.css';

function History() {
  
    const visits = [
        {
            description: "вечерний макияж",
            date: "25.01.2024",
            master: "София",
            duration: "1,5 часа",
            price: "2500р."
        },
        {
            description: "вечерний макияж",
            date: "25.01.2024",
            master: "София",
            duration: "1,5 часа",
            price: "2500р."
        },
        {
            description: "вечерний макияж",
            date: "25.01.2024",
            master: "София",
            duration: "1,5 часа",
            price: "2500р."
        }
    ];

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
