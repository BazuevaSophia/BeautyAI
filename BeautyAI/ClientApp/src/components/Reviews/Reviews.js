import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Reviews.css';

function Reviews() {
    const [reviews, setReviews] = useState([]);
    const [comment, setComment] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('/api/profile/getProfile', { withCredentials: true });
                setCurrentUser(response.data);
            } catch (error) {
                console.error('Ошибка при загрузке профиля:', error);
            }
        };

        const fetchReviews = async () => {
            try {
                const response = await axios.get('/api/general-reviews');
                setReviews(response.data);
            } catch (error) {
                console.error('Ошибка при загрузке отзывов:', error);
            }
        };

        fetchProfile();
        fetchReviews();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setImagePreviewUrl(file ? URL.createObjectURL(file) : '');
    };

    const adjustTextareaHeight = (e) => {
        e.target.style.height = "inherit";
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!currentUser) {
            alert('Вы не вошли в систему. Пожалуйста, войдите или зарегистрируйтесь.');
            return;
        }

        const formData = new FormData();
        formData.append('comment', comment);
        formData.append('userId', currentUser.userId);
        if (image) {
            formData.append('photo', image);
        }

        try {
            const response = await axios.post('/api/general-reviews', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });
            setReviews([...reviews, response.data]);
            setComment('');
            setImage(null);
            setImagePreviewUrl('');
        } catch (error) {
            console.error('Ошибка при отправке отзыва:', error);
        }
    };

    const handleDelete = async (reviewId) => {
        if (window.confirm('Вы уверены, что хотите удалить этот отзыв?')) {
            try {
                await axios.delete(`/api/general-reviews/${reviewId}`, { withCredentials: true });
                setReviews(reviews.filter(review => review.ReviewId2 !== reviewId));
            } catch (error) {
                console.error('Ошибка при удалении отзыва:', error);
            }
        }
    };

    return (
        <div className="reviews-page">
            <h1>System Reviews</h1>
            <div className="reviews-links">
                <Link to="/">Главная</Link>
                <Link to="/history">История</Link>
                <Link to="/profile">Профиль</Link>
            </div>
            <div className="reviews-content">
                {reviews.map(review => (
                    <div key={review.ReviewId2} className="review-item">
                        <p>{review.UserName}: {review.Comment}</p>
                        {review.Photo && review.Photo.length > 0 && (
                            <div className="photos">
                                {review.Photo.map((photo, index) => (
                                    <img key={`${review.ReviewId2}-${index}`} src={photo} alt="Review" className="review-photo" />
                                ))}
                            </div>
                        )}
                        {currentUser && currentUser.userId === review.UserId && (
                            <button onClick={() => handleDelete(review.ReviewId2)} className="delete-button">Удалить</button>
                        )}
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
                        id="file-upload"
                        type="file"
                        onChange={handleImageChange}
                        className="review-file-input"
                    />
                    <label htmlFor="file-upload" className="custom-file-label">Выбрать фото</label>
                    <button type="submit" className="submit-button">Отправить</button>
                </form>
            </div>
        </div>
    );
}

export default Reviews;
