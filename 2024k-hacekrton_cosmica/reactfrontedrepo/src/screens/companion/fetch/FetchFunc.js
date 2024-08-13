import Config from "react-native-config";
import {REACT_APP_SPRING_API_URL} from '@env'


export const fetchFunc = (url, additionalData) => {
    const defaultUrl = "http://172.30.128.214:8080";
    console.log()
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(additionalData)
    };

    return fetch(defaultUrl + url, options)
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            return data;
        })
        .catch(error=>{
            console.error('Error:', error);
            throw error;
        });
};
