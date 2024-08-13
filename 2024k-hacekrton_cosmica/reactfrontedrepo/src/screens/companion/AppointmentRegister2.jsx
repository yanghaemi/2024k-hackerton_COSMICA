import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';

const RegisterCompanionScreen = () => {
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [bill, setBill] = useState('');

    const handleDatePress = () => {
        // Date picker logic can be implemented here
    };

    const handleSubmit = () => {
        // Submit button logic
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>동행자 등록</Text>

            <TouchableOpacity onPress={handleDatePress}>
                <TextInput
                    style={styles.input}
                    value={date}
                    placeholder="원하시는 날짜를 선택해주세요"
                    editable={false}
                    pointerEvents="none"
                />
            </TouchableOpacity>

            <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
                placeholder="위치를 입력해주세요"
            />

            <TextInput
                style={styles.input}
                value={bill}
                onChangeText={setBill}
                placeholder="가격을 입력해주세요"
                keyboardType="numeric"
            />

            <Button title="등록" onPress={handleSubmit} color="#1976D2" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 32,
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginTop: 16,
    },
    button: {
        marginTop: 32,
        backgroundColor: '#1976D2',
        paddingVertical: 12,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});

export default RegisterCompanionScreen;