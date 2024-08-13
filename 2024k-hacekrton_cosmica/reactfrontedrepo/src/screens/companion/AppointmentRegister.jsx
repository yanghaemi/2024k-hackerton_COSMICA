import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { fetchFunc } from "./fetch/FetchFunc";
import {useNavigation} from "@react-navigation/native";

const AppointmentRegister = ({ route }) => {
    // route.params에서 item을 추출
    const { selectedDate } = route.params; // 여기서 selectedDate가 전달된 날짜 값입니다.
    const [wheelchairId, setWheelchairId] = useState('');
    const [companionId, setCompanionId] = useState('');
    const [appointDate, setAppointDate] = useState(new Date(selectedDate)); // selectedDate로 초기화
    const [location, setLocation] = useState('');
    const [bill, setBill] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const navigation = useNavigation();

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setAppointDate(selectedDate);
        }
    };

    const handleSubmit = (url) => {
        const appointmentData = {
            wheelchairId: parseInt(wheelchairId, 10),
            companionId: parseInt(companionId, 10),
            appointDate: appointDate.toISOString(), // Date 객체를 ISO 문자열로 변환
            location,
            bill: parseFloat(bill),
        };
        console.log('Submitted Data:', appointmentData);
        fetchFunc(url, appointmentData)
            .then(data => {
                console.log('Success:', data);
                alert("정상 등록되었습니다.");
                navigation.navigate("CalendarPage");
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Appointment Register</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => setShowDatePicker(true)}
            >
                <Text>Select Date: {appointDate.toDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={appointDate}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                />
            )}
            <TextInput
                style={styles.input}
                placeholder="위치를 입력해주세요"
                value={location}
                onChangeText={setLocation}
            />
            <TextInput
                style={styles.input}
                placeholder="가격을 입력해주세요"
                keyboardType="numeric"
                value={bill}
                onChangeText={setBill}
            />
            <Button title="등록" onPress={() => handleSubmit('/appointment/register')} color="#1976D2" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 32,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#1976D2',
        borderColor: '#ccc', // 연한 회색 테두리
        borderWidth: 1, // 테두리 두께
        borderRadius: 5,
        padding: 10, // 버튼 내부 여백
        paddingVertical: 12,
        marginBottom: 16, // 버튼 아래 간격
        marginTop: 32,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});

export default AppointmentRegister;