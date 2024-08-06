import React, { useState } from "react";
import { View, TextInput, Alert, StyleSheet } from "react-native";
import FetchJSONButton from "./FetchJSONButton";

const Login = () => {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");

    const onChangeId = (text) => {
        if (/^\d*$/.test(text)) {
            setId(text);
        } else {
            Alert.alert("경고", "ID는 숫자만 입력 가능합니다.");
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="id(숫자만 입력 가능합니다)"
                value={id}
                onChangeText={onChangeId}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="pw"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <FetchJSONButton
                url="/users/login"
                additionalData1={{id,password}}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
});

export default Login;
