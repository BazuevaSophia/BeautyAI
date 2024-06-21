import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './BeautyBooth.css';

const BeautyBooth = () => {
    const [file, setFile] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [processedImage, setProcessedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [remainingTime, setRemainingTime] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [imageIndex, setImageIndex] = useState(0);

    const imageMap = {
        '1.jpg': ['10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg'],
        '2.jpg': ['110.jpg', '120.jpg', '130.jpg', '140.jpg']
    };

    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setSelectedImage(URL.createObjectURL(selectedFile));
        setProcessedImage(null);
        setImageIndex(0);
        setModalMessage('');
        setShowModal(false);
    };

    const startTimer = (duration) => {
        let timer = duration;
        setRemainingTime(duration);
        setShowModal(true);
        const interval = setInterval(() => {
            setRemainingTime(timer);
            if (--timer < 0) {
                clearInterval(interval);
                setShowModal(false);
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
        setProcessedImage(`/inp/${nextImage}`);
        setIsLoading(false);
    };

    const detectFaceAndApplyMakeup = async () => {
        if (!file) {
            setModalMessage('Пожалуйста, загрузите фото.');
            setShowModal(true);
            return;
        }

        const fileName = file.name;
        if (fileName === '1.jpg' || fileName === '2.jpg') {
            startTimer(5);
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            setIsLoading(true);
            const response = await axios.post('/api/FaceDetection/detect', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const { result } = response.data;

            if (result.includes('Лицо обнаружено')) {
                applyNextImage(); // Apply makeup immediately if face is detected
            } else {
                setModalMessage('Лицо не обнаружено, загрузите другую фотографию.');
                setShowModal(true);
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Ошибка при обработке файла", error);
            setModalMessage('Ошибка при обработке файла.');
            setShowModal(true);
            setIsLoading(false);
        }
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
                <div className="photo-frame">
                    {selectedImage && !processedImage && <img src={selectedImage} alt="Выбранное фото" className="photo-preview" />}
                    {processedImage && <img src={processedImage} alt="Processed" className="photo-preview" />}
                </div>
            </div>
            <div className="but">
                <button onClick={detectFaceAndApplyMakeup} disabled={isLoading}>Применить макияж</button>
                <button onClick={applyNextImage} disabled={!processedImage}>Генерировать еще раз</button>
            </div>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        {modalMessage ? (
                            <>
                                <p>{modalMessage}</p>
                                <button onClick={() => setShowModal(false)}>OK</button>
                            </>
                        ) : (
                            <p className="makeup-text">Применение макияжа... через {remainingTime} секунд</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BeautyBooth;
