import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Reviews.css';

function Reviews() {
    const [reviews, setReviews] = useState([]);
    const [comment, setComment] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setImagePreviewUrl(file ? URL.createObjectURL(file) : '');
    };

    const adjustTextareaHeight = (e) => {
        e.target.style.height = "inherit"; // Сбросить высоту
        e.target.style.height = `${e.target.scrollHeight}px`; // Установить новую высоту
    };

    useEffect(() => {
        // Загрузка отзывов при монтировании компонента
        axios.get('/api/reviews')
            .then(response => setReviews(response.data))
            .catch(error => console.error('Ошибка загрузки отзывов:', error));
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('comment', comment);
        if (image) {
            formData.append('image', image);
        }

        axios.post('/api/reviews', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(response => {
                setReviews([...reviews, response.data]); // Добавление нового отзыва к существующему списку
                setComment(''); // Очистка поля комментария
                setImage(null); // Сброс выбранного изображения
            })
            .catch(error => console.error('Ошибка при отправке отзыва:', error));
    };

    return (
        <div className="reviews-page">
            <h1>BeautyAI</h1>
            <div className="reviews-links">
                <Link to="/">Главная</Link>
                <Link to="/history">История</Link>
                <Link to="/profile">Профиль</Link>
            </div>
            <div className="reviews-content">
                {reviews.map(review => (
                    <div key={review.id} className="review-item">
                        <p>{review.authorName}: {review.text}</p>
                        {review.imageUrl && <img src={review.imageUrl} alt="Отзыв" className="review-image" />}
                    </div>
                ))}
                <form onSubmit={handleSubmit} className="review-form">
                    <textarea
                        value={comment}
                        onChange={(e) => {
                            setComment(e.target.value);
                            adjustTextareaHeight(e);
                        }}
                        required
                        className="review-textarea"
                    />
                    {imagePreviewUrl && (
                        <img src={imagePreviewUrl} alt="Preview" className="review-image-preview" />
                    )}
                    <input
                        type="file"
                        onChange={handleImageChange}
                        className="review-file-input"
                    />
                    <button type="submit" className="submit-button">Отправить</button>
                </form>
            </div>
        </div>
    );
}

export default Reviews;
