import Config from "react-native-config";


export const fetchFunc = (url, additionalData) => {
    const defaultUrl = "http://172.18.13.36:8080";
    console.log(additionalData);
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
