import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyPortfolio.css';

function MyPortfolio() {
    const [photos, setPhotos] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                const response = await fetch('https://localhost:7125/api/myportfolio', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                const result = await response.json();
                setPhotos(result);
            } catch (error) {
                alert('Ошибка при загрузке портфолио');
            }
        };

        fetchPortfolio();
    }, []);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const uploadPhoto = async () => {
        if (!selectedFile) {
            alert('Пожалуйста, выберите файл.');
            return;
        }

        const formData = new FormData();
        formData.append('photo', selectedFile);

        try {
            const response = await fetch('https://localhost:7125/api/myportfolio/uploadPhoto', {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                setPhotos([...photos, result.photo]);
                setSelectedFile(null);
                alert('Фотография успешно загружена!');
            } else {
                throw new Error('Ошибка при загрузке фотографии');
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const deletePhoto = async (photoUrl) => {
        if (!window.confirm('Точно ли вы хотите удалить эту фотографию?')) {
            return;
        }

        try {
            const response = await fetch('https://localhost:7125/api/myportfolio/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ photoUrl }),
            });

            if (response.ok) {
                setPhotos(photos.filter(photo => photo !== photoUrl));
                alert('Фотография успешно удалена!');
            } else {
                throw new Error('Ошибка при удалении фотографии');
            }
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="my-portfolio-page">
            <h1>BeautyAI</h1>
            <div className="portfolio-container">
                {photos.map((photo, index) => (
                    <div key={index} className="photo-item">
                        <img src={photo} alt={`Portfolio ${index}`} />
                        <button className="delete-button" onClick={() => deletePhoto(photo)}>
                            <img src="delete.png" alt="Удалить" />
                        </button>
                    </div>
                ))}
                <div className="add-phot">
                    <input
                        type="file"
                        id="file-input"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                    <label htmlFor="file-input" className="custm-file-upload">
                        <img src="add.png" alt="Выбрать фото" className="add-icn" />
                    </label>
                    <button className="upload-button" onClick={uploadPhoto}>
                        Загрузить
                    </button>
                </div>
            </div>
            <button className="bck-buttn" onClick={() => navigate(-1)}>Назад</button>
        </div>
    );
}

export default MyPortfolio;
