import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { loadModels, detectFaces } from './FaceDetection';
import './BeautyBooth.css';
import * as faceapi from 'face-api.js';

const BeautyBooth1 = () => {
    const [file, setFile] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [processedImage, setProcessedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [remainingTime, setRemainingTime] = useState(0);
    const [imageIndex, setImageIndex] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');

    const imageMap = {
        '1.jpg': ['10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg'],
        '2.jpg': ['110.jpg', '120.jpg', '130.jpg', '140.jpg']
    };

    useEffect(() => {
        const MODEL_URL = process.env.PUBLIC_URL + '/models';
        loadModels(MODEL_URL).catch(error => {
            console.error('Ошибка при загрузке моделей:', error);
            setErrorMessage('Ошибка при загрузке моделей. Пожалуйста, попробуйте позже.');
        });
    }, []);

    const handleImageChange = async (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        try {
            const image = await faceapi.bufferToImage(selectedFile);
            const detections = await detectFaces(image);

            if (detections.length === 0) {
                setErrorMessage('Загруженное изображение не содержит лица. Пожалуйста, загрузите изображение с лицом.');
            } else {
                console.log('Лица обнаружены:', detections);
                setSelectedImage(URL.createObjectURL(selectedFile));
                setProcessedImage(null);
                setImageIndex(0);
                setErrorMessage('');
            }
        } catch (error) {
            console.error('Ошибка при обработке изображения:', error);
            setErrorMessage('Ошибка при обработке изображения. Пожалуйста, попробуйте другое изображение.');
        }
    };

    const startTimer = (duration) => {
        let timer = duration;
        setRemainingTime(duration);
        const interval = setInterval(() => {
            setRemainingTime(timer);
            if (--timer < 0) {
                clearInterval(interval);
                applyNextImage();
            }
        }, 1000);
    };

    const applyNextImage = () => {
        if (!file) return;
        const fileName = file.name;
        const images = imageMap[fileName];
        if (!images || imageIndex >= images.length) return;
        const nextImage = images[imageIndex];
        setImageIndex(prevIndex => prevIndex + 1);
        setProcessedImage(`/uploads/${nextImage}`);
        setIsLoading(false);
    };

    const applyMakeup = () => {
        setIsLoading(true);
        startTimer(5);
    };

    return (
        <div className="beauty-booth-page">
            <h1>BeautyAI</h1>
            <p className="custom-text">Привет, я твой виртуальный помощник,
                давай подберем тебе макияж, с учетом особенностей твоего лица.
                Я покажу тебе самые трендовые мейкапы этого сезона! Если ты не профи в макияже, я помогу подобрать тебе мейк самостоятельно.
                Чтобы начать, нажми на кнопку "Выбрать фото" и выбери его из галереи </p>

            <div className="beauty-booth-links">
                <Link to="/">Главная</Link>
                <Link to="/history">История</Link>
                <Link to="/profile">Профиль</Link>
            </div>

            <img src="bot2.png" alt="Bot" className="bot-image" />
            <input type="file" id="file" onChange={handleImageChange} style={{ display: 'none' }} />
            <label htmlFor="file" className="choose-photo-button">Выбрать фото</label>

            <div className="beauty-booth-content">
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <div className="photo-frame">
                    {selectedImage && !processedImage && <img src={selectedImage} alt="Выбранное фото" className="photo-preview" />}
                    {processedImage && <img src={processedImage} alt="Processed" className="photo-preview" />}
                </div>
            </div>
            <div className="but">
                <button onClick={applyMakeup} disabled={isLoading || !!errorMessage}>Применить макияж</button>
                <button onClick={applyNextImage} disabled={!processedImage}>Генерировать еще раз</button>
                {isLoading && <div>Загрузка... {remainingTime} секунд осталось</div>}
            </div>
        </div>
    );
};

export default BeautyBooth1;
