import React, { useEffect, useState } from "react";
import { ScrollView, Image, Button, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { fetchFunc2 } from "../../fetch/FetchFunc2";
import { useNavigation } from "@react-navigation/native";
import fetchFunc4 from "../../fetch/FetchFunc4";
import fetchFunc3 from "../../fetch/FetchFunc3";

const DetailAppointment = ({route}) => {
    const url = "/users/findById";
    const navigation = useNavigation();
    const { item } = route.params;
    const [userData, setUserData] = useState(null);
    const [myData, setMyData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //item 매칭 정보
    useEffect(() => {
        const request = item.companionId === 0 ? item.wheelchairId : item.companionId;

        const fetchData = async () => {
            try {
                const userDataResponse = await fetchFunc2(url, { id: request });
                setUserData(userDataResponse);
                console.log("User info", userDataResponse);

                const myDataResponse = await fetchFunc3("/users/myInfo");
                setMyData(myDataResponse);
                console.log('My info:', myDataResponse);

            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url, item.companionId]);

    if (loading) {
        return <Text>Loading...</Text>;
    }

    if (error) {
        return <Text>Error: {error.message}</Text>;
    }

    const isButtonDisabled = userData && myData && userData.userType === myData.userType;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.innerContainer}>

                {/* Title */}
                <Text style={styles.title}>
                    {userData.userType === "WHEELCHAIR" ? `휠체어 이용자` : `동행자`}
                </Text>
                <View style={styles.separator} />

                {/* Personal Information */}
                <View style={styles.tableLayout}>
                    <View style={styles.tableRow}>
                        <View style={styles.imageContainer}>
                            <Image
                                style={styles.image}
                                source={{ uri: 'https://via.placeholder.com/100' }}
                            />
                        </View>
                        <View style={styles.infoContainer}>
                            <Text style={styles.label}>이름:  {userData.userName}</Text>
                            <Text style={styles.label}>위치:  {item.location}</Text>
                            <Text style={styles.label}>날짜:  {item.appointDate}</Text>
                            <Text style={styles.label}>비용:  {item.bill}</Text>
                        </View>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>등급</Text>
                <View style={styles.separator} />
                <View style={styles.tableLayout}>
                    <View style={styles.tableRow}>
                        <Text style={styles.infoText}>{userData.rate}</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>횟수</Text>
                <View style={styles.separator} />
                <View style={styles.tableLayout}>
                    <View style={styles.tableRow}>
                        <Text style={styles.infoText}>{userData.times}</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>동행자 리뷰</Text>
                <View style={styles.separator} />
                <View style={styles.tableLayout}>
                    <View style={styles.tableRow}>
                        <Text style={styles.infoText}>"리뷰 내용"</Text>
                    </View>
                </View>

                {/* Custom Button */}
                <TouchableOpacity
                    style={[styles.customButton,
                        isButtonDisabled && styles.disabledButton // disabledButton 스타일을 추가
                    ]}
                    onPress={() => navigation.navigate("CheckoutPage", { item,userData })}
                    disabled={isButtonDisabled}
                >
                    <Text style={styles.buttonText}>신청 하기</Text>
                </TouchableOpacity>

            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
    },
    innerContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    title: {
        fontSize: 28, // Larger title font size
        fontWeight: 'bold', // Bold font
        color: '#333', // Darker color
        textAlign: 'center',
        marginBottom: 20, // Increased margin for spacing
    },
    tableLayout: {
        marginBottom: 16,
    },
    tableRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    imageContainer: {
        padding: 8,
    },
    image: {
        width: 100,
        height: 100,
        backgroundColor: 'darkgray',
        borderRadius: 10, // Rounded corners for the image
    },
    infoContainer: {
        flex: 1,
        padding: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#555',
        marginBottom: 4,
    },
    infoText: {
        fontSize: 16,
        color: '#444', // Slightly darker text color for better readability
        marginBottom: 10, // More spacing between text items
        paddingHorizontal: 8,
    },
    sectionTitle: {
        fontSize: 20, // Larger section title
        fontWeight: '600', // Semi-bold font weight
        color: '#444', // Consistent text color with other sections
        paddingTop: 20,
        paddingBottom: 8,
    },
    separator: {
        borderBottomColor: '#bbb',
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginVertical: 10,
    },
    customButton: {
        backgroundColor: '#6200EE', // 기본 버튼 색상
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    disabledButton: {
        backgroundColor: '#aaaaaa', // 버튼 비활성화 시 회색
    },

    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default DetailAppointment;