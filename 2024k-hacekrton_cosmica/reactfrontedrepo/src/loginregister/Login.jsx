import React, { useState } from "react";
import { View, TextInput, Alert, StyleSheet, ScrollView, Image, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { fetchFunc } from "../screens/companion/fetch/FetchFunc";

const Login = () => {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const navigation = useNavigation();

    const onChangeId = (text) => {
        if (/^\d*$/.test(text)) {
            setId(text);
        } else {
            Alert.alert("경고", "ID는 숫자만 입력 가능합니다.");
        }
    };

    const handleLogin = () => {
        fetchFunc("/users/login", { id, password })
            .then(data => {
                console.log('Success:', data);
                    navigation.navigate("MyPage");
            })
            .catch(error => {
                console.error('Error:', error);
                Alert.alert("로그인 실패", "서버에 문제가 발생했습니다. 나중에 다시 시도해 주세요.");
            });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image
                source={require('../image/11zon_cropped.png')} // 로고 이미지 경로를 맞게 설정하세요
                style={styles.logo}
                accessibilityLabel="Logo"
            />

            <View style={styles.formContainer}>
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#888"
                    placeholder="아이디 (숫자만 입력 가능합니다)"
                    value={id}
                    onChangeText={onChangeId}
                    keyboardType="numeric"
                />

                <TextInput
                    style={styles.input}
                    placeholder="비밀번호"
                    placeholderTextColor="#888"
                    secureTextEntry
                    onChangeText={setPassword}
                    value={password}
                />

                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>로그인</Text>
                </TouchableOpacity>

                <View style={styles.linksContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                        <Text style={styles.link}>회원가입</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    logo: {
        width: 160, // 크기 조정
        height: 160, // 크기 조정
        marginBottom: 40,
        resizeMode: 'contain',
    },
    formContainer: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 20,
        elevation: 3, // 그림자 효과
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 16,
        fontSize: 16,
    },
    loginButton: {
        backgroundColor: '#000',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 4,
        alignItems: 'center',
        marginBottom: 16,
    },
    loginButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    linksContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    link: {
        color: '#000', // 링크 색상
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Login;
