import React, {useEffect, useState} from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { fetchFunc } from "../../fetch/FetchFunc";
import { useNavigation } from "@react-navigation/native";
import {REACT_APP_SPRING_API_URL} from "@env";

const AppointmentRegister = ({ route }) => {
    const { selectedDate } = route.params;
    const [wheelchairId, setWheelchairId] = useState('');
    const [companionId, setCompanionId] = useState('');
    const [appointDate, setAppointDate] = useState(new Date(selectedDate));
    const [location, setLocation] = useState('');
    const [bill, setBill] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [payType,setPayType]=useState("");
    const [userInfo,setUserInfo]=useState(null);
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [needCar,setNeedCar]=useState(false);
    const [hasCar,setHasCar]=useState(false);
    const [car,setCar]=useState("");
    const [hourlyRate, setHourlyRate]=useState('');
    const navigation = useNavigation();

    useEffect(()=>{
        console.log("Spring url",REACT_APP_SPRING_API_URL);
        fetch(REACT_APP_SPRING_API_URL + '/users/myInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();  // 여기가 중요합니다
            })
            .then(data => {
                console.log("Parsed JSON data:", data); // 여기에 실제 데이터가 들어가야 합니다
                setUserInfo(data);
            })
            .catch(error=>{
                console.log("AppointmentRegister에서 자기 정보 못가져옴.");
                console.log(error);
            })
    },[]);

    const formatDate = (date) => {
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            weekday: 'long',
        };
        return new Intl.DateTimeFormat('ko-KR', options).format(date);
    };

    const formatTime = (time) => {
        const options = {
            hour: '2-digit',
            minute: '2-digit',
        };
        return new Intl.DateTimeFormat('ko-KR', options).format(time);
    };

    const calculateTotalBill = () => {
        const start = new Date(startTime);
        const end = new Date(endTime);
        const diffHours = (end - start) / (1000 * 60 * 60); // milliseconds to hours
        return parseFloat(hourlyRate) * diffHours;
    };

    const formatTimeInKorean = (date) => {
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Seoul',  // 한국 시간대로 설정
            hour12: false  // 24시간 형식
        };
        return new Intl.DateTimeFormat('ko-KR', options).format(date);
    };

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setAppointDate(selectedDate);
        }
    };

    const handlePayType=(text)=>{
        setPayType(text);
        console.log(payType);
    }

    const onStartTimeChange = (event, selectedDate) => {
        setShowStartPicker(false);
        console.log(selectedDate);
        if (selectedDate) setStartTime(selectedDate);
    };

    const onEndTimeChange = (event, selectedDate) => {
        setShowEndPicker(false)
        console.log(selectedDate);
        if (selectedDate) setEndTime(selectedDate);
    };

    const handleSubmit = (url) => {
        const appointmentData = {
            wheelchairId: parseInt(wheelchairId, 10),
            companionId: parseInt(companionId, 10),
            appointDate: appointDate.toISOString(),
            location,
            bill: parseInt(bill),
            start: startTime,
            end: endTime,
            carRequire:needCar,
            carName:car,
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
                    {appointDate ? formatDate(appointDate) : "날짜 선택"}
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
            {userInfo && userInfo.userType === 'COMPANION' ? (
                <Text style={styles.companionText}>동행 가능시간</Text>
            ) : userInfo && userInfo.userType === 'WHEELCHAIR' ? (
                <Text style={styles.companionText}>이용 시간</Text>
            ) : null}

            <View style={styles.timeContainer}>
                <TouchableOpacity style={styles.timeButton} onPress={() => setShowStartPicker(true)}>
                    <Text style={styles.timeButtonText}>시작: {formatTime(startTime)}</Text>
                </TouchableOpacity>
                {showStartPicker && (
                    <DateTimePicker
                        value={startTime}
                        mode="time"
                        display="spinner"
                        onChange={onStartTimeChange}
                    />
                )}
                <Text>~</Text>
                <TouchableOpacity style={styles.timeButton} onPress={() => setShowEndPicker(true)}>
                    <Text style={styles.timeButtonText}>종료: {formatTime(endTime)}</Text>
                </TouchableOpacity>
                {showEndPicker && (
                    <DateTimePicker
                        value={endTime}
                        mode="time"
                        display="spinner"
                        onChange={onEndTimeChange}
                    />
                )}
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.justButton,
                        payType === '시급' && styles.selectedButton
                    ]}
                    onPress={() => handlePayType("시급")}
                >
                    <Text style={styles.justButtonText}>시간별 보수</Text>
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    placeholder={'시간당 지급 보수를 지정해주세요.'}
                    keyboardType="numeric"
                    value={hourlyRate}
                    onChangeText={setHourlyRate}
                />
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[
                        styles.justButton,
                        payType === '건급' && styles.selectedButton
                    ]}
                    onPress={() => handlePayType("건급")}
                >
                    <Text style={styles.justButtonText}>건별 보수</Text>
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    placeholder={payType === "건급" && hourlyRate ? `${calculateTotalBill()}원을 지급해야 합니다.` : "약속 이후 지급 총액을 지정해주세요."}
                    keyboardType="numeric"
                    value={bill}
                    onChangeText={setBill}
                />
            </View>


            {userInfo && (
                userInfo.userType === "WHEELCHAIR" ? (
                    <View style={styles.vehicleContainer}>
                        <Text style={styles.vehicleText}>차량 필요 유무</Text>
                        <TouchableOpacity style={[
                            styles.vehicleButton,
                            needCar&& styles.selectedButton
                        ]} onPress={()=>setNeedCar(true)}
                        >
                            <Text style={styles.vehicleButtonText}>차량 필요</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[
                            styles.vehicleButton,
                            !needCar && styles.selectedButton
                        ]} onPress={()=>setNeedCar(false)}
                        >
                            <Text style={styles.vehicleButtonText}>차량 불필요</Text>
                        </TouchableOpacity>
                    </View>
                ) : userInfo.userType === "COMPANION" ? (
                    <View>
                        <View style={styles.companionContainer}>
                            <Text style={styles.companionText}>차량 보유 현황</Text>
                            <TouchableOpacity style={[
                                styles.companionButton,
                                hasCar && styles.selectedButton
                            ]} onPress={()=>setHasCar(true)}>
                                <Text style={styles.companionButtonText}>차량 보유</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[
                                styles.companionButton,
                                !hasCar && styles.selectedButton
                            ]} onPress={()=>setHasCar(false)}>
                                <Text style={styles.companionButtonText}>차량 미보유</Text>
                            </TouchableOpacity>
                        </View>
                        {hasCar &&(
                            <TextInput
                                style={styles.input}
                                placeholder={"차량명을 입력하세요"}
                                value={car}
                                onChangeText={(car) => setCar(car)}
                            />
                        )}
                    </View>
                ) : null
            )}
            <TouchableOpacity
                style={styles.submitButton}
                onPress={() => handleSubmit('/appointment/register')}>
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent:'space-around',
        marginBottom: 15,
    },
    dateButton: {
        backgroundColor: 'black',
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
    selectedButton:{
        backgroundColor: 'lightblue',
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: '#fff',
        width:250,
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
    justButton: {
        backgroundColor: 'black',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width:100,
        height:50
    },
    justButtonText:{
        fontSize: 15,
        color: '#fff',
        lineHeight:40,
    },
    submitButtonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
    timeContainer:{
        flexDirection: 'row',
        justifyContent:'space-around',
    },
    timeButton:{
        backgroundColor: 'black',
        borderRadius: 10,
        paddingHorizontal: 20,
        marginBottom: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    timeButtonText: {
        fontSize: 18,
        color: '#fff',
    },
    companionContainer: {
        marginVertical: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-around',
    },
    companionText: {
        fontSize: 18,
        marginBottom: 10,
        color: '#333',
    },
    companionButton: {
        backgroundColor: 'black',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 5,
        alignItems: 'center',
    },
    companionButtonText: {
        fontSize: 16,
        color: '#fff',
    },
    vehicleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-around',
    },
    vehicleText: {
        fontSize: 18,
        marginBottom: 10,
        color: '#333',
    },
    vehicleButton: {
        backgroundColor: 'black',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 5,
        alignItems: 'center',
        marginBottom: 15,
    },
    vehicleButtonText: {
        fontSize: 16,
        color: '#fff',
    },
});

export default AppointmentRegister;
