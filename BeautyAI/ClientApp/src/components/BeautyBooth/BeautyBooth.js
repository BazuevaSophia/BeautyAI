import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './BeautyBooth.css';

function BeautyBooth() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [selectedFeature, setSelectedFeature] = useState('lips'); // Состояние для выбранной функции макияжа
    const [isLoading, setIsLoading] = useState(false);
    const [originalImage, setOriginalImage] = useState(null);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const imageFile = e.target.files[0];
            setSelectedImageFile(imageFile); // Сохраняем файл для отправки на сервер
            const imagePreviewUrl = URL.createObjectURL(imageFile);
            setOriginalImage(imagePreviewUrl); // Сохраняем исходное изображение для отката
            setSelectedImage(imagePreviewUrl);
        }
    };

    const applyMakeup = async () => {
        if (!selectedImageFile || !selectedFeature) return; // Проверяем, что файл и функция макияжа выбраны

        console.log(selectedImageFile); // Логируем выбранный файл для отладки

        setIsLoading(true);
        const formData = new FormData();
        formData.append('file', selectedImageFile); // Добавляем файл в форму

        try {
            // Используем выбранную функцию макияжа в параметрах запроса
            const response = await fetch(`http://127.0.0.1:8000/apply-makeup/?choice=${selectedFeature}`, {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.blob();
            const makeupImage = URL.createObjectURL(data);
            setSelectedImage(makeupImage); // Устанавливаем обработанное изображение
        } catch (error) {
            console.error('Ошибка при отправке изображения: ', error);
        } finally {
            setIsLoading(false); // Снимаем индикатор загрузки
        }
    };


    const handleShowOriginal = () => {
        if (originalImage) {
            setSelectedImage(originalImage); // Возвращаем оригинальное изображение
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
            <div className="select-container">
                <label htmlFor="file" className="btn-choose-photo">Выбрать фото</label> 
                <select value={selectedFeature} onChange={e => setSelectedFeature(e.target.value)}>
                    <option value="lips">Помада</option>
                    <option value="blush">Румяна</option>
                </select>
            </div>
            <img src="bot2.png" alt="Bot" className="bot-image" />
            <input type="file" id="file" onChange={handleImageChange} style={{ display: 'none' }} />
            
            <div className="beauty-booth-content">
                <div className="photo-frame">
                    {selectedImage && <img src={selectedImage} alt="Выбранное фото" className="photo-preview" />}
                </div>
            </div>
            <div className="but">
                <button onClick={applyMakeup} disabled={isLoading}>Применить макияж</button>
                <button onClick={handleShowOriginal} disabled={!originalImage}>Показать оригинал</button>
                {isLoading && <div>Загрузка...</div>}
            </div>
           
            </div>
        );
    }

    export default BeautyBooth;