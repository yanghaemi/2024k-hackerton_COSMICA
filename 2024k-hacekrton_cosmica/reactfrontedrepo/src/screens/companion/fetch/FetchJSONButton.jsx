import React from "react";
import { Button } from "react-native";
import {fetchFunc} from "./FetchFunc";

const FetchJSONButton = ({url, additionalData1, onLoginSuccess}) =>
{
    const fetchData=()=>{
        fetchFunc(url,additionalData1)
            .then(data => {
                console.log('Success:', data);
                onLoginSuccess();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    return (
        <>
            <Button title="로그인" onPress={fetchData} />
        </>
    );
};

export default FetchJSONButton;
