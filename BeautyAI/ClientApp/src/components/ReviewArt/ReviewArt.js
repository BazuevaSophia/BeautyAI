import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './ReviewArt.css';

function ReviewArt() {
    const navigate = useNavigate();
    const { artistId } = useParams();
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const apiUrl = '/api'; 

        fetch(`${apiUrl}/artists/${artistId}/reviews`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => setReviews(data))
            .catch(error => console.error('Ошибка при загрузке отзывов:', error));
    }, [artistId]);

    return (
        <div className="review-art-page">
            <h1>BeautyAI</h1>
            <div className="review-art-links">
                <Link to="/">Главная</Link>
                <Link to="/history">История</Link>
                <Link to="/profile">Профиль</Link>
            </div>
            <div className="reviews">
                {reviews.map(review => (
                    <div key={review.reviewId} className="review-wrapper">
                        <div className="user-name-container">
                            <p className="user-name"><strong>{review.userName}</strong></p>
                        </div>
                        <div className="visit">
                            <p className="comment">{review.comment}</p>
                            {review.photos && review.photos.length > 0 && (
                                <div className="photos">
                                    {review.photos.map((photo, index) => (
                                        <img key={`${review.reviewId}-${index}`} src={photo} alt="Review" className="review-photo" />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <button className="back-button" onClick={() => navigate(-1)}>Назад</button>
        </div>
    );
}

export default ReviewArt;
