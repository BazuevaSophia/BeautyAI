import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyService.css';

function MyService() {
    const [services, setServices] = useState([]);
    const [newService, setNewService] = useState({
        name: '',
        description: '',
        price: '',
        duration: '',
        photo: null
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch('https://localhost:7125/api/myservice', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                if (response.ok) {
                    const result = await response.json();
                    setServices(result);
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Ошибка при загрузке услуг');
                }
            } catch (error) {
                alert(error.message);
            }
        };

        fetchServices();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewService(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setNewService(prevState => ({
            ...prevState,
            photo: e.target.files[0]
        }));
    };

    const handleAddService = async () => {
        const formData = new FormData();
        formData.append('name', newService.name);
        formData.append('description', newService.description);
        formData.append('price', newService.price);
        formData.append('duration', newService.duration);
        if (newService.photo) {
            formData.append('photo', newService.photo);
        }

        try {
            const response = await fetch('https://localhost:7125/api/myservice', {
                method: 'POST',
                credentials: 'include',
                body: formData
            });
            if (response.ok) {
                const result = await response.json();
                setServices([...services, result]);
                setNewService({ name: '', description: '', price: '', duration: '', photo: null });
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка при добавлении услуги');
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDeleteService = async (serviceId) => {
        try {
            const response = await fetch(`https://localhost:7125/api/myservice/${serviceId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            if (response.ok) {
                setServices(services.filter(service => service.serviceId !== serviceId));
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка при удалении услуги');
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const handleUpdateService = async (service) => {
        const formData = new FormData();
        formData.append('name', service.name);
        formData.append('description', service.description);
        formData.append('price', service.price);
        formData.append('duration', service.duration);
        if (service.photo) {
            formData.append('photo', service.photo);
        }

        try {
            const response = await fetch(`https://localhost:7125/api/myservice/${service.serviceId}`, {
                method: 'PUT',
                credentials: 'include',
                body: formData
            });
            if (response.ok) {
                alert('Услуга успешно обновлена');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка при обновлении услуги');
            }
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="my-service-page">
            <h1>BeautyAI</h1>
            <div className="services-container">
                {services.map(service => (
                    <div key={service.serviceId} className="service-card">
                        {service.photo && <img src={service.photo[0]} alt={service.name} />}
                        <input
                            type="text"
                            value={service.name}
                            onChange={(e) => setServices(services.map(s => s.serviceId === service.serviceId ? { ...s, name: e.target.value } : s))}
                            onBlur={() => handleUpdateService(service)}
                        />
                        <textarea
                            value={service.description}
                            onChange={(e) => setServices(services.map(s => s.serviceId === service.serviceId ? { ...s, description: e.target.value } : s))}
                            onBlur={() => handleUpdateService(service)}
                        />
                        <input
                            type="text"
                            value={service.duration}
                            onChange={(e) => setServices(services.map(s => s.serviceId === service.serviceId ? { ...s, duration: e.target.value } : s))}
                            onBlur={() => handleUpdateService(service)}
                        />
                        <input
                            type="text"
                            value={service.price}
                            onChange={(e) => setServices(services.map(s => s.serviceId === service.serviceId ? { ...s, price: e.target.value } : s))}
                            onBlur={() => handleUpdateService(service)}
                        />
                        <button className="delete-button" onClick={() => handleDeleteService(service.serviceId)}>Удалить</button>
                    </div>
                ))}
            </div>
            <div className="new-service">
                <h2>Добавить новую услугу</h2>
                <input
                    type="text"
                    name="name"
                    placeholder="Название услуги"
                    value={newService.name}
                    onChange={handleInputChange}
                />
                <textarea
                    name="description"
                    placeholder="Описание услуги"
                    value={newService.description}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="duration"
                    placeholder="Длительность"
                    value={newService.duration}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="price"
                    placeholder="Стоимость"
                    value={newService.price}
                    onChange={handleInputChange}
                />
                <input
                    type="file"
                    name="photo"
                    onChange={handleFileChange}
                />
                <button className="add-button" onClick={handleAddService}>Добавить</button>
            </div>
            <button className="bck-buttn" onClick={() => navigate(-1)}>Назад</button>
        </div>
    );
}

export default MyService;
