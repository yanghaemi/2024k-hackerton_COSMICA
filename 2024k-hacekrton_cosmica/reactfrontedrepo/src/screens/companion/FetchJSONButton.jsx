import React from "react";
import { Button } from "react-native";

const FetchJSONButton = ({method= 'POST',url, contentType = 'application/json', additionalData1}) =>
{
    const defaultUrl = "http://172.30.128.72:8080";

    const fetchData = () => {
        const options = {
            method: method,
            headers: {
                'Content-Type': contentType,
            },
            body: method === 'POST' ? JSON.stringify(additionalData1) : JSON.stringify(a),
        };

        fetch(defaultUrl + url, options)
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    return (
        <Button title="Fetch Data" onPress={fetchData} />
    );
};

export default FetchJSONButton;
