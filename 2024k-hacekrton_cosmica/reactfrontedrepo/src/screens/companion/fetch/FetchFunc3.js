import Config from "react-native-config";
import {REACT_APP_SPRING_API_URL} from '@env'

export const fetchFunc3 = (url, additionalData = null) => {
    const defaultUrl = "http://172.30.128.214:8080"; // 환경변수로 변경하려면 Config.API_URL 사용
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // JSON 데이터로 전송하는 경우
        },
        body: additionalData ? JSON.stringify(additionalData) : undefined // JSON으로 변환
    };

    return fetch(defaultUrl + url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('성공:', data);
            return data;
        })
        .catch(error => {
            console.error('오류:', error);
            return null; // 오류가 발생하면 null을 반환하여 로그인되지 않은 상태로 간주
        });
};

export default fetchFunc3;
