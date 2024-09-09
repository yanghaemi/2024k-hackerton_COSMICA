import React, { useState } from 'react';
import {ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {REACT_APP_SPRING_API_URL} from '@env';
import {fetchFunc} from "../../../fetch/FetchFunc";
import {useNavigation} from "@react-navigation/native";

const Register = () => {
    const navigation = useNavigation();
    const [user, setUser] = useState({
        id: 0,
        pw: "",
        userName: "",
        phoneNum: "",
        userType: "",
        location: "",
        rate: "",
        times: "",
        car:"",
        verify: false
    });

    const [confirmPw, setConfirmPw] = useState("");
    const [passwordMismatch, setPasswordMismatch] = useState(false);
    const [phoneNumInvalid, setPhoneNumInvalid] = useState(false);
    const [hasCar, setHasCar]= useState(false);

    const handleChange = (name, value) => {
        setUser({
            ...user,
            [name]: value,
        });
    };

    const onChangeId = (text) => {
        if (/^\d*$/.test(text)) {
            handleChange("id", Number(text)); // ID 값을 숫자로 변환하여 저장
        } else {
            Alert.alert("경고", "ID는 숫자만 입력 가능합니다.");
        }
    };

    const onChangePassword = (text) => {
        handleChange("pw", text);
        if (text !== confirmPw) {
            setPasswordMismatch(true);
        } else {
            setPasswordMismatch(false);
        }
    };

    const onChangeConfirmPassword = (text) => {
        setConfirmPw(text);
        if (user.pw !== text) {
            setPasswordMismatch(true);
        } else {
            setPasswordMismatch(false);
        }
    };

    const onChangePhoneNum = (text) => {
        handleChange("phoneNum", text);
        if (text.length !== 11) {
            setPhoneNumInvalid(true);
        } else {
            setPhoneNumInvalid(false);
        }
    };

    const onUserTypeSelect = (type) => {
        handleChange("userType", type);
    };

    const onChangeHasCar=(boolean)=>{
        setHasCar(boolean);
    }


    const isRegisterButtonEnabled = () => {
        return user.id !== 0 && !passwordMismatch && !phoneNumInvalid &&user.userName!=="" && user.phoneNum!=="" && user.userType!=="" &&user.location!=="";
    };

    const doRegister=()=>{
        fetchFunc("/users/register", user );
        Alert.alert("회원가입이 완료되었습니다.");
        navigation.navigate("MyPage");
    }

    const checkDuplicateId = async () => {
        try {
            const response = await fetch(`${REACT_APP_SPRING_API_URL}/users/findById`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded", // 변경된 Content-Type
                },
                body: new URLSearchParams({ id: user.id.toString() }).toString(), // URL 인코딩된 형식으로 전송
            });

            if (response.ok) {
                const existingUser = await response.json();
                if (existingUser) {
                    Alert.alert("경고", "이미 존재하는 아이디입니다.");
                    onChangeId("0");
                }
            } else if (response.status === 404) {
                Alert.alert("확인", "사용 가능한 아이디입니다.");
            }
            else if(response.status === 400){
                Alert.alert("0은 아이디로 사용이 불가능합니다.")
            }
        } catch (EmptyResultDataAccessException) {
            Alert.alert("사용 가능한 아이디입니다.")
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>회원가입</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    placeholder="아이디 (숫자만 입력 가능합니다)"
                    value={user.id.toString()}
                    onChangeText={(text) => onChangeId(text)}
                />
                <TouchableOpacity style={styles.smallButton} onPress={checkDuplicateId}>
                    <Text style={styles.smallButtonText}>중복확인</Text>
                </TouchableOpacity>
            </View>

            <TextInput
                style={styles.input}
                placeholder="비밀번호"
                value={user.pw}
                onChangeText={(text) => onChangePassword(text)}
                secureTextEntry
            />

            <TextInput
                style={styles.input}
                placeholder="비밀번호 확인"
                value={confirmPw}
                onChangeText={(text) => onChangeConfirmPassword(text)}
                secureTextEntry
            />

            {passwordMismatch && (
                <Text style={styles.errorText}>비밀번호가 일치하지 않습니다.</Text>
            )}

            <TextInput
                style={styles.input}
                placeholder="이름 (실명 입력)"
                value={user.userName}
                onChangeText={(text) => handleChange("userName", text)}
            />

            <TextInput
                style={styles.input}
                placeholder="휴대전화번호 ('-'제외)"
                keyboardType="phone-pad"
                value={user.phoneNum}
                onChangeText={onChangePhoneNum}
            />

            {phoneNumInvalid && (
                <Text style={styles.errorText}>휴대전화번호는 11자리 숫자여야 합니다.</Text>
            )}

            <View style={styles.radioContainer}>
                <Text style={styles.label}>이용자 유형:</Text>
                <View style={styles.radioButton}>
                    <TouchableOpacity
                        style={[
                            styles.radio,
                            user.userType === "WHEELCHAIR" && styles.selectedRadio,
                        ]}
                        onPress={() => onUserTypeSelect("WHEELCHAIR")}
                    >
                        <Text>휠체어 이용자</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.radio,
                            user.userType === "COMPANION" && styles.selectedRadio,
                        ]}
                        onPress={() => onUserTypeSelect("COMPANION")}
                    >
                        <Text>동행자</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.radioContainer}>
                <Text style={styles.label}>차량 유무:</Text>
                <View style={styles.radioButton}>
                    <TouchableOpacity
                        style={[
                            styles.radio,
                            hasCar === true && styles.selectedRadio,
                        ]}
                        onPress={()=>{onChangeHasCar(true)}}
                    >
                        <Text>유</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.radio,
                            hasCar === false && styles.selectedRadio,
                        ]}
                        onPress={()=>{onChangeHasCar(false)}}
                    >
                        <Text>무</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <TextInput
                style={[
                    styles.input,
                    hasCar===false && styles.inputDisabled
                ]}
                placeholder="차 종"
                editable={hasCar}
                onChangeText={(text)=>handleChange("car",text)}
            />
            <TextInput
                style={styles.input}
                placeholder="거주 지역"
                value={user.location}
                onChangeText={(text) => handleChange("location", text)}
            />


            <TouchableOpacity
                style={[styles.button, !isRegisterButtonEnabled() && styles.buttonDisabled]}
                onPress={() => {doRegister()}}
                disabled={!isRegisterButtonEnabled()}
            >
                <Text style={styles.buttonText}>회원가입</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 16,
    },
    input: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 8,
        backgroundColor: '#fff',
        marginBottom: 16,
    },
    inputDisabled:{
        backgroundColor: '#aaaaaa'
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    smallButton: {
        backgroundColor: '#000',
        borderRadius: 4,
        width: 80,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    smallButtonText: {
        color: '#fff',
        fontSize: 14,
    },
    button: {
        backgroundColor: '#000',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 4,
        alignItems: 'center',
        marginBottom: 16,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    radioContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    radio: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 12,
        padding: 8,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
    },
    radioButton: {
        flexDirection: "row",
    },
    label: {
        marginRight: 8,
    },
    selectedRadio: {
        backgroundColor: 'lightblue',
    },
    errorText: {
        color: 'red',
        marginBottom: 16,
    },
    buttonDisabled: {
        backgroundColor: '#ccc', // 비활성화 상태의 버튼 색상
    },
});

export default Register;
