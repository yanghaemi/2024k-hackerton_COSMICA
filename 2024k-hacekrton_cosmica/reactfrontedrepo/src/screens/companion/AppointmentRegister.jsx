import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { fetchFunc } from "./fetch/FetchFunc";

const AppointmentRegister = () => {
    const [wheelchairId, setWheelchairId] = useState('');
    const [companionId, setCompanionId] = useState('');
    const [appointDate, setAppointDate] = useState(new Date());
    const [location, setLocation] = useState('');
    const [bill, setBill] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

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
            appointDate: appointDate.toISOString(),
            location,
            bill: parseFloat(bill),
        };
        console.log('Submitted Data:', appointmentData);
        fetchFunc(url, appointmentData)
            .then(data => {
                console.log('Success:', data);
                alert("정상 등록되었습니다.");
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
                placeholder="Location"
                value={location}
                onChangeText={setLocation}
            />
            <TextInput
                style={styles.input}
                placeholder="Bill"
                keyboardType="numeric"
                value={bill}
                onChangeText={setBill}
            />
            <Button title="Submit" onPress={() => handleSubmit('/appointment/register')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 8,
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#fff', // 흰색 배경
        borderColor: '#ccc', // 연한 회색 테두리
        borderWidth: 1, // 테두리 두께
        borderRadius: 4, // 모서리 둥글기
        padding: 10, // 버튼 내부 여백
        marginBottom: 16, // 버튼 아래 간격
    },
});

export default AppointmentRegister;
