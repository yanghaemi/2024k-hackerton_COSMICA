import React, { useState } from "react";
import { View, TextInput, Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
import FetchJSONButton from "./fetch/FetchJSONButton";

const Login = () => {
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
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="id(숫자만 입력 가능합니다)"
                value={user.id}
                onChangeText={(text) => onChangeId(text)}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="pw"
                value={user.pw}
                onChangeText={(text) => handleChange("pw", text)}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="User Name"
                value={user.userName}
                onChangeText={(text) => handleChange("userName", text)}
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
                placeholder="Location"
                value={user.location}
                onChangeText={(text) => handleChange("location", text)}
            />
            <FetchJSONButton
                url="/users/register"
                additionalData1={user}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
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

export default Login;
