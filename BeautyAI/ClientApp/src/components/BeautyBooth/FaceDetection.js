import * as faceapi from 'face-api.js';

const loadModels = async (MODEL_URL) => {
    try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
        console.log('ssdMobilenetv1 загружена успешно');
    } catch (error) {
        console.error('Ошибка при загрузке ssdMobilenetv1:', error);
    }
    try {
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        console.log('faceLandmark68Net загружена успешно');
    } catch (error) {
        console.error('Ошибка при загрузке faceLandmark68Net:', error);
    }
    try {
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        console.log('faceRecognitionNet загружена успешно');
    } catch (error) {
        console.error('Ошибка при загрузке faceRecognitionNet:', error);
    }
};

const detectFaces = async (image) => {
    try {
        return await faceapi.detectAllFaces(image, new faceapi.SsdMobilenetv1Options()).withFaceLandmarks().withFaceDescriptors();
    } catch (error) {
        console.error('Ошибка при обнаружении лиц:', error);
        return [];
    }
};

export { loadModels, detectFaces };
