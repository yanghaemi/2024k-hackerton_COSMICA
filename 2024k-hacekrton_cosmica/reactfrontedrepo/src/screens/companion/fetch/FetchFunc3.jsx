import Config from "react-native-config";

export const fetchFunc3 = (url, additionalData = null) => {
    const defaultUrl = "http://172.18.13.36:8080"; // 환경변수로 변경하려면 Config.API_URL 사용

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // JSON 데이터로 전송하는 경우
        },
        body: additionalData ? JSON.stringify(additionalData) : undefined // JSON으로 변환
    };

    return fetch(defaultUrl + url, options)
        .then(response => response.json())
        .then(data => {
            console.log('성공:', data);
            return data;
        })
        .catch(error => {
            console.error('오류:', error);
            throw error;
        });
};

export default fetchFunc3;
