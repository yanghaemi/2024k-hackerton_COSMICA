import React from "react";
import { Button } from "react-native";
import {fetchFunc} from "./FetchFunc";

const FetchJSONButton = ({url, additionalData1}) =>
{
    const fetchData=()=>{
        fetchFunc(url,additionalData1)
            .then(data => {
                console.log('Success:', data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    return (
        <>
            <Button title="Fetch Data" onPress={fetchData} />
        </>
    );
};

export default FetchJSONButton;
