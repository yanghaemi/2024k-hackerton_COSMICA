import React, { useState } from "react";
import { View, TextInput, Alert, StyleSheet, Button } from "react-native";
import FetchJSONButton from "../fetch/FetchJSONButton";

const Login = ({ navigation, onLoginSuccess }) => {
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
                onLoginSuccess={onLoginSuccess} //로그인 성공 시 호출할 함수
            />
            <Button //회원 가입 이동 버튼
                title="회원 가입" 
                onPress={() => navigation.navigate('Register')} // Register 화면으로 이동
                color="blue"
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
