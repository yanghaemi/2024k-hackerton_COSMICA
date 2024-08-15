import React, { useState } from "react";
import {View, TextInput, Alert, StyleSheet, ScrollView, Image, Text, TouchableOpacity} from "react-native";
import FetchJSONButton from "../screens/companion/fetch/FetchJSONButton";
import {useNavigation} from "@react-navigation/native";

const Login = () => {  const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const navigation = useNavigation();
    const onChangeId = (text) => {
        if (/^\d*$/.test(text)) {
            setId(text);
        } else {
            Alert.alert("경고", "ID는 숫자만 입력 가능합니다.");
        }
    };
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image
                source={require('../image/11zon_cropped.png')} // 로고 이미지 경로를 맞게 설정하세요
                style={styles.logo}
                accessibilityLabel="Logo"
            />

            <TextInput
                style={styles.input}
                placeholderTextColor="#888"
                placeholder="id(숫자만 입력 가능합니다)"
                value={id}
                onChangeText={onChangeId}
                keyboardType="numeric"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#888"
                secureTextEntry
                onChangeText={setPassword}
                value={password}
            />

            <View style={styles.linksContainer}>
                <FetchJSONButton
                    url="/users/login"
                    additionalData1={{id,password}}
                />
                <Text style={styles.separator}> | </Text>
                <TouchableOpacity>
                    <Text style={styles.link} onPress={()=>navigation.navigate("Register")}>Register</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
        alignItems: 'center',
    },
    logo: {
        width: 163, // 이전 크기의 절반
        height: 168.5, // 이전 크기의 절반
        marginBottom: 32,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 8,
        marginBottom: 16,
    },
    linksContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
    },
    link: {
        color: '#007BFF', // 링크 색상
        fontSize: 14,
    },
    separator: {
        color: '#888',
        fontSize: 14,
    },
});

export default Login;