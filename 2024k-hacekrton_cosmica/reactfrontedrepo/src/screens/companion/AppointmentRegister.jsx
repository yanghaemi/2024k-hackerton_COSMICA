import React, { useState } from 'react';
import {View, Text, TextInput, Button, StyleSheet, TouchableOpacity} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { fetchFunc } from "./FetchFunc";
import {backgroundColor} from "react-native-calendars/src/style";

const AppointmentRegister = () => {
    const [wheelchairId, setWheelchairId] = useState('');
    const [companionId, setCompanionId] = useState('');
    const [appointmentDate, setAppointmentDate] = useState(new Date());
    const [location, setLocation] = useState('');
    const [bill, setBill] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        setAppointmentDate(selectedDate || appointmentDate);
    };

    const handleSubmit = (url) => {
        const appointmentData = {
            wheelchairId: parseInt(wheelchairId, 10),
            companionId: parseInt(companionId, 10),
            appointmentDate: appointmentDate.toISOString(),
            location,
            bill: parseFloat(bill),
        };
        console.log('Submitted Data:', appointmentData);
        fetchFunc(url, appointmentData)
            .then(data => {
                console.log('Success:', data);
                alert(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Appointment Register</Text>
                <TouchableOpacity style={styles.button} title={`Select Date: ${appointmentDate.toDateString()}`} onPress={() => setShowDatePicker(true)}>
                    <Text>Select Date</Text>
                </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={appointmentDate}
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
