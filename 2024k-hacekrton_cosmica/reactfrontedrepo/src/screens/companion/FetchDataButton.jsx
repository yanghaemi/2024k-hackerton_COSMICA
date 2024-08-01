import React from "react";
import { Button } from "react-native";

const FetchJSONButton = ({url, additionalData1}) =>
{
    const defaultUrl = "http://172.30.128.72:8080";
    const fetchData = () => {
        const options = {
            method:'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
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
