import Config from "react-native-config";

export const fetchFunc2 = (url, additionalData=null) => {
    const defaultUrl = "http://172.30.128.30:8080";
    const params = new URLSearchParams();

    // additionalData 객체를 URLSearchParams 객체로 변환
    for (const [key, value] of Object.entries(additionalData)) {
        params.append(key, value);
    }

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(), // URL 인코딩된 문자열로 변환
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
