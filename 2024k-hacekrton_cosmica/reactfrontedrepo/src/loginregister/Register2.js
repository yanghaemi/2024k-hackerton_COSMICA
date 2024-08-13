import React, {useState} from 'react';
import {
    ScrollView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    CheckBox, Alert
} from 'react-native';
import FetchJSONButton from "../screens/companion/fetch/FetchJSONButton";

const SignUpScreen = () => {
    const [user, setUser] = useState({
        id: "",
        pw: "",
        userName: "",
        userType: "",
        location: "",
        rate: "",
        times: "",
    });

    const handleChange = (name, value) => {
        setUser({
            ...user,
            [name]: value,
        });
    };

    const onChangeId = (text) => {
        if (/^\d*$/.test(text)) {
            handleChange("id", text);
        } else {
            Alert.alert("경고", "ID는 숫자만 입력 가능합니다.");
        }
    };

    const onUserTypeSelect = (type) => {
        handleChange("userType", type);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>회원가입</Text>

            <TextInput
                style={styles.input}
                value={user.id}
                placeholder="id(숫자만 입력 가능합니다)"
                onChangeText={(text) => onChangeId(text)}
                keyboardType="numeric"            />

            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>중복확인</Text>
            </TouchableOpacity>

            <TextInput
                style={styles.input}
                value={user.pw}
                placeholder="비밀번호"
                onChangeText={(text) => handleChange("pw", text)}
                secureTextEntry
            />

            <TextInput
                style={styles.input}
                placeholder="비밀번호 확인"
                secureTextEntry
            />

            <TextInput
                value={user.userName}
                style={styles.input}
                onChangeText={(text) => handleChange("userName", text)}
                placeholder="이름 (실명 입력)"
            />

            <TextInput
                style={styles.input}
                placeholder="휴대전화번호 ('-'제외)"
                keyboardType="phone-pad"
            />

            <TextInput
                style={styles.input}
                placeholder="생년월일 (8자리 입력)"
                keyboardType="numeric"
            />

            <View style={styles.radioContainer}>
                <Text style={styles.label}>User Type:</Text>
                <View style={styles.radioButton}>
                    <TouchableOpacity
                        style={[
                            styles.radio,
                            user.userType === "WHEELCHAIR" && styles.selectedRadio,
                        ]}
                        onPress={() => onUserTypeSelect("WHEELCHAIR")}
                    >
                        <Text>Wheelchair</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.radio,
                            user.userType === "COMPANION" && styles.selectedRadio,
                        ]}
                        onPress={() => onUserTypeSelect("COMPANION")}
                    >
                        <Text>Companion</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <TextInput
                style={styles.input}
                placeholder="지역"
                value={user.location}
                onChangeText={(text) => handleChange("location", text)}
            />

            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>회원가입</Text>
            </TouchableOpacity>
            <FetchJSONButton
                url="/users/register"
                additionalData1={user}
            />
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
        marginBottom: 16,
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
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    checkbox: {
        marginRight: 8,
    },
    checkboxLabel: {
        fontSize: 14,
    },
    radioContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    label: {
        marginRight: 8,
    },
    radioButton: {
        flexDirection: "row",
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
    selectedRadio: {
        backgroundColor: 'lightblue',
    },
});

export default SignUpScreen;