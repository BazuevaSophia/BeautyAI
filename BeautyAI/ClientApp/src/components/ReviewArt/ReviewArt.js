import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import './ReviewArt.css';

function ReviewArt() {
    const navigate = useNavigate();
    const location = useLocation();
    const { artistId } = useParams();
    const [reviews, setReviews] = useState([]);
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);
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
                const response = await axios.get(`/api/artists/${artistId}/reviews`);
                setReviews(response.data);
            } catch (error) {
                console.error('Ошибка при загрузке отзывов:', error);
            }
        };

        fetchProfile();
        fetchReviews();
    }, [artistId]);

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
        formData.append('rating', rating);
        formData.append('userId', currentUser.userId);
        if (image) {
            formData.append('photo', image);
        }

        try {
            const response = await axios.post(`/api/artists/${artistId}/reviews`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });
            setReviews([...reviews, response.data]);
            setComment('');
            setImage(null);
            setRating(0);
            setImagePreviewUrl('');

            await axios.post(`/api/artists/updateRatings`);
        } catch (error) {
            console.error('Ошибка при отправке отзыва:', error);
        }
    };

    const handleDelete = async (reviewId) => {
        if (window.confirm('Вы уверены, что хотите удалить этот отзыв?')) {
            try {
                await axios.delete(`/api/artists/reviews/${reviewId}`, { withCredentials: true });
                setReviews(reviews.filter(review => review.reviewId !== reviewId));
            } catch (error) {
                console.error('Ошибка при удалении отзыва:', error);
            }
        }
    };

    const handleRatingClick = (newRating) => {
        setRating(newRating);
    };

    return (
        <div className="reviewPage">
            <h1>BeautyAI</h1>
            <div className="reviewLinks">
                <Link to="/">Главная</Link>
                <Link to="/history">История</Link>
                <Link to="/profile">Профиль</Link>
            </div>
            <form onSubmit={handleSubmit} className="reviewForm">
                <textarea
                    value={comment}
                    onChange={(e) => {
                        setComment(e.target.value);
                        adjustTextareaHeight(e);
                    }}
                    placeholder="Напишите ваш отзыв..."
                    required
                    className="reviewTextarea"
                />
                {imagePreviewUrl && (
                    <img src={imagePreviewUrl} alt="Preview" className="reviewImagePreview" />
                )}
                <input
                    id="file-upload"
                    type="file"
                    onChange={handleImageChange}
                    className="review-art-file-input"
                />
                <label htmlFor="file-upload" className="customFileLabel">Выбрать фото</label>
                <div className="ratingInput">
                    <label>Оценка:</label>
                    {[1, 2, 3, 4, 5].map(star => (
                        <span
                            key={star}
                            className={`star ${star <= rating ? 'filled' : ''}`}
                            onClick={() => handleRatingClick(star)}
                        >
                            ★
                        </span>
                    ))}
                </div>
                <button type="submit" className="submitButton">Отправить</button>
            </form>
            <div className="reviews">
                {reviews.map(review => (
                    <div key={review.reviewId} className="reviewWrapper">
                        <div className="userNameContainer">
                            <p className="userName"><strong>{review.userName}</strong></p>
                        </div>
                        <div className="visit">
                            <p className="comment">{review.comment}</p>
                            {review.photos && review.photos.length > 0 && (
                                <div className="photos">
                                    {review.photos.map((photo, index) => (
                                        <img key={`${review.reviewId}-${index}`} src={photo} alt="Review" className="reviewPhoto" />
                                    ))}
                                </div>
                            )}
                        </div>
                        {currentUser && currentUser.userId === review.userId && (
                            <button onClick={() => handleDelete(review.reviewId)} className="deleteButton">Удалить</button>
                        )}
                    </div>
                ))}
            </div>
            <button className="backButton" onClick={() => navigate(-1)}>Назад</button>
        </div>
    );
}

export default ReviewArt;
