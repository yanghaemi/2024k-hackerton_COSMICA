import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { fetchFunc } from "../../fetch/FetchFunc";
import { useNavigation } from "@react-navigation/native";

const AppointmentRegister = ({ route }) => {
    const { selectedDate } = route.params;
    const [wheelchairId, setWheelchairId] = useState('');
    const [companionId, setCompanionId] = useState('');
    const [appointDate, setAppointDate] = useState(new Date(selectedDate));
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
            appointDate: appointDate.toISOString(),
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
            <Text style={styles.title}>매칭 등록</Text>

            <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
            >
                <Text style={styles.dateButtonText}>
                    {appointDate ? appointDate.toDateString() : "Select Date"}
                </Text>
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
                placeholder="만날 장소를 입력하세요"
                value={location}
                onChangeText={setLocation}
            />

            <TextInput
                style={styles.input}
                placeholder="금액을 입력하세요"
                keyboardType="numeric"
                value={bill}
                onChangeText={setBill}
            />

            <TouchableOpacity
                style={styles.submitButton}
                onPress={() => handleSubmit('/appointment/register')}
            >
                <Text style={styles.submitButtonText}>등록하기</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#f4f4f9',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    },
    dateButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dateButtonText: {
        fontSize: 18,
        color: '#fff',
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: '#fff',
        fontSize: 16,
    },
    submitButton: {
        backgroundColor: 'black',
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButtonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default AppointmentRegister;
