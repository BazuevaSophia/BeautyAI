import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Reviews.css';

function Reviews() {
    const [reviews, setReviews] = useState([]);
    const [comment, setComment] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const handleFileSelect = () => {
        fileInputRef.current.click();
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const reviewsResponse = await axios.get('https://localhost:44476/api/generalreviews');
                setReviews(reviewsResponse.data);

                try {
                    const profileResponse = await axios.get('https://localhost:44476/api/profile/getProfile', { withCredentials: true });
                    setCurrentUser(profileResponse.data);
                } catch (error) {
                    console.error('Ошибка при загрузке данных профиля:', error);
                }
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
            }
        }
        fetchData();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setImagePreviewUrl(file ? URL.createObjectURL(file) : '');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!currentUser) {
            navigate('/authorization'); 
            return;
        }
        const formData = new FormData();
        formData.append('comment', comment);
        formData.append('userId', currentUser.userId);
        if (image) {
            formData.append('photo', image);
        }
        try {
            const response = await axios.post('https://localhost:44476/api/generalreviews', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
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
                await axios.delete(`https://localhost:44476/api/generalreviews/${reviewId}`, { withCredentials: true });
                setReviews(reviews.filter(review => review.reviewId2 !== reviewId));
            } catch (error) {
                console.error('Ошибка при удалении отзыва:', error);
            }
        }
    };

    return (
        <div className="reviews-page">
            <h1>BeautyAI</h1>
            <div className="reviews-links">
                <Link to="/">Главная</Link>
                <Link to="/history">История</Link>
                <Link to="/profile">Профиль</Link>
            </div>
            <form onSubmit={handleSubmit} className="reviewForm">
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
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
                    ref={fileInputRef}
                    className="reviewFileInput"
                />
                <label htmlFor="file-upload" className="customFile" onClick={handleFileSelect}>Выбрать фото</label>
                <button type="submit" className="formSubmitButton">Отправить</button>
            </form>
            <div className="reviewsContent">
                {reviews.length > 0 ? reviews.map(review => (
                    <div key={review.reviewId2} className="reviewWrapper">
                        <div className="userNameContainer">
                            <p className="userName"><strong>{review.userName}</strong></p>
                        </div>
                        <div className="visit">
                            <p className="comment">{review.comment}</p>
                            {review.photo && review.photo.length > 0 && (
                                <div className="photos">
                                    {review.photo.map((photo, index) => (
                                        <img key={`${review.reviewId2}-${index}`} src={photo} alt="Review" className="reviewPhoto" />
                                    ))}
                                </div>
                            )}
                        </div>
                        {currentUser && currentUser.userId === review.userId && (
                            <button onClick={() => handleDelete(review.reviewId2)} className="deleteButton">Удалить</button>
                        )}
                    </div>
                )) : <p>Отзывов пока нет.</p>}
            </div>
        </div>
    );
}

export default Reviews;
