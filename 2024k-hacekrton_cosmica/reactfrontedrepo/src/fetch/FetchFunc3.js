import Config from "react-native-config";
import { REACT_APP_SPRING_API_URL } from '@env';

export const fetchFunc3 = (url, additionalData = null) => {
    const defaultUrl = REACT_APP_SPRING_API_URL;
    console.log(defaultUrl);


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
                // 오류를 로그로만 남기고, 화면에는 노출하지 않음
                return null;
            }
            return response.json();
        })
        .then(data => {
            console.log('성공:', data);
            return data;
        })
        .catch(error => {
            // 오류를 로그로만 남기고, 화면에는 노출하지 않음
            console.error('오류:', error);
            return null; // 오류가 발생하면 null을 반환하여 로그인되지 않은 상태로 간주
        });
};

export default fetchFunc3;