import Config from "react-native-config";
import {REACT_APP_SPRING_API_URL} from '@env'

export const fetchFunc4 = (url, additionalData = null) => {
    const defaultUrl = REACT_APP_SPRING_API_URL; // 환경변수로 변경하려면 Config.API_URL 사용
    console.log(REACT_APP_SPRING_API_URL);
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // JSON 데이터로 전송하는 경우
        },
        body: additionalData ? JSON.stringify(additionalData) : undefined // JSON으로 변환
    };

    return fetch(defaultUrl + url, options)
        .then(response => {
            return response;
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            return null; // 오류가 발생하면 null을 반환하여 로그인되지 않은 상태로 간주
        });
};

export default fetchFunc4;
