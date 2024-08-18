import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert, Modal, TextInput } from 'react-native';
import fetchFunc3 from "../../fetch/FetchFunc3";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {fetchFunc} from "../../fetch/FetchFunc";

const MyPage = () => {
    const [myData, setMyData] = useState(null);
    const [appointments, setAppointments] = useState([]); // Initialize as an empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const navigation = useNavigation();

    const fetchData = async () => {
        setLoading(true);
        try {
            const myDataResponse = await fetchFunc3("/users/myInfo");
            setMyData(myDataResponse);
            console.log("My info in MyPage", myDataResponse);

            const myAppointmentResponse = await fetchFunc3("/appointment/my");
            setAppointments(myAppointmentResponse || []); // Ensure it's an array
            console.log("My appointments", myAppointmentResponse);
        } catch (err) {
            setError(err);
            Alert.alert("Error", "Failed to load data.");
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchData();
        }, [refresh])
    );

    const getUserType = (type) => {
        switch (type) {
            case 'COMPANION':
                return '동행자';
            case 'WHEELCHAIR':
                return '휠체어 이용자';
            default:
                return '사용자 유형';
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await fetchFunc3("/users/logout");
            setMyData(null);
            setAppointments([]);
            setRefresh(prev => !prev);
        } catch (err) {
            setError(err);
            Alert.alert("Error", "로그아웃 실패");
        } finally {
            setLoading(false);
        }
    };

    const openReviewModal = (appointment) => {
        setSelectedAppointment(appointment);
        setModalVisible(true);
    };

    const submitReview = () => {
        console.log('Submitted Review:', reviewText, 'Rating:', rating);
        selectedAppointment.review = reviewText;
        selectedAppointment.rate = rating;
        fetchFunc("/appointment/review",selectedAppointment);
        console.log("선택된 매칭 리뷰 작성 결과:", selectedAppointment);
        setModalVisible(false);
    };

    // Ensure appointments is an array before calling filter
    const reviewCount = (Array.isArray(appointments) ? appointments.filter(appointment => appointment.review).length : 0);

    if (loading) {
        return <View style={styles.loaderContainer}><ActivityIndicator size="large" color="#0000ff" /></View>;
    }

    if (error) {
        return <View style={styles.errorContainer}><Text style={styles.errorText}>Failed to load data.</Text></View>;
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.profileSection}>
                <View style={styles.profileText}>
                    <Text style={styles.userName}>{myData?.userName || '사용자 이름'}</Text>
                    <Text style={styles.userType}>사용자 유형: {getUserType(myData?.userType)}
                        {myData?.userType === 'COMPANION' && ` | 평점: ${myData?.rate}`}
                    </Text>
                </View>
            </View>

            <View style={styles.projectSection}>
                <Text style={styles.sectionTitle}>나의 활동 내역</Text>
                <View style={styles.projectInfo}>
                    <View style={styles.projectItem}>
                        <Text style={styles.itemLabel}>경로저장</Text>
                        <Text style={styles.itemValue}>{myData?.projectInfo?.routesSaved || 'N/A'}</Text>
                    </View>
                    <View style={styles.projectItem}>
                        <Text style={styles.itemLabel}>리뷰</Text>
                        <Text style={styles.itemValue}>{reviewCount || 'N/A'}</Text>
                    </View>
                    <View style={styles.projectItem}>
                        <Text style={styles.itemLabel}>신고</Text>
                        <Text style={styles.itemValue}>{myData?.projectInfo?.reports || 'N/A'}</Text>
                    </View>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.customButton} onPress={() => {}}>
                        <Text style={styles.buttonText}>저장한 경로</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.customButton} onPress={() => navigation.navigate("MyReview", { appointments })}>
                        <Text style={styles.buttonText}>리뷰 내역</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.customButton} onPress={() => {}}>
                        <Text style={styles.buttonText}>신고 내역</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.otherSection}>
                <View style={styles.otherItem}>
                    <Text style={styles.otherText}>동행 횟수</Text>
                    <Text style={styles.otherCount}>{myData?.times || '0'}</Text>
                </View>
                <View style={styles.otherItem}>
                    <Text style={styles.otherText}>거주 지역</Text>
                    <Text style={styles.otherCount}>{myData?.location || '거주지역'}</Text>
                </View>
            </View>

            <View style={styles.accountSection}>
                <View style={styles.accountItem}>
                    {myData ? (
                        <TouchableOpacity style={styles.customButton} onPress={logout}>
                            <Text style={styles.buttonText}>로그아웃</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.customButton} onPress={() => { navigation.navigate("Login") }}>
                            <Text style={styles.buttonText}>로그인</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <View style={styles.historySection}>
                <Text style={styles.historyText}>동행 이력</Text>
                {appointments.length ? (
                    appointments.map((appointment, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.appointmentItem,
                                !appointment.review && styles.noReviewItem, // review가 없으면 스타일 변경
                            ]}
                            onPress={() => {
                                if (myData?.userType === 'WHEELCHAIR') {
                                    if(appointment.wheelchairId && appointment.companionId) {
                                        openReviewModal(appointment); // Modal 열기
                                    } else {
                                        Alert.alert("매칭 상대 미정","아직 매칭상대가 정해지지 않아 리뷰를 등록할 수 없습니다.")
                                    }
                                } else {
                                    Alert.alert("권한 없음", "리뷰 등록은 휠체어 이용자만 가능합니다.");
                                }
                            }} // Modal 열기
                        >
                            <Text>날짜: {appointment.appointDate}</Text>
                            <Text>위치: {appointment.location}</Text>
                            <Text>비용: {appointment.bill}원</Text>
                            {!appointment.review && myData?.userType === 'WHEELCHAIR' && (
                                <Text style={styles.noReviewText}>리뷰 등록하기</Text> // 리뷰가 없는 경우 표시
                            )}
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text>No appointments found.</Text>
                )}
            </View>

            {/* 리뷰 작성 Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>리뷰 작성</Text>
                        <Text>평점:</Text>
                        <View style={styles.ratingContainer}>
                            {[1, 2, 3, 4, 5].map((value) => (
                                <TouchableOpacity
                                    key={value}
                                    style={[
                                        styles.ratingButton,
                                        rating === value && styles.selectedRatingButton,
                                    ]}
                                    onPress={() => setRating(value)}
                                >
                                    <Text style={styles.ratingButtonText}>{value}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <Text>리뷰:</Text>
                        <TextInput
                            style={styles.input}
                            multiline
                            value={reviewText}
                            onChangeText={setReviewText}
                        />
                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.blackButton]}
                                onPress={submitReview}
                            >
                                <Text style={styles.buttonText}>제출</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text>취소</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
    profileSection: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        padding: 16,
    },
    profileText: {
        marginLeft: 8,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    userType: {
        fontSize: 14,
        marginTop: 4,
    },
    ratingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    ratingButton: {
        backgroundColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        width: 40,
        alignItems: 'center',
    },
    selectedRatingButton: {
        backgroundColor: '#000',
    },
    ratingButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        width: '48%',
        alignItems: 'center',
    },
    blackButton: {
        backgroundColor: '#000',
    },
    projectSection: {
        backgroundColor: '#ffffff',
        marginTop: 16,
        padding: 16,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    projectInfo: {
        flexDirection: 'row',
        marginTop: 16,
        justifyContent: 'space-around',
    },
    projectItem: {
        alignItems: 'center',
    },
    itemLabel: {
        fontSize: 14,
    },
    itemValue: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 4,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 16,
    },
    customButton: {
        backgroundColor: '#000',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 14,
    },
    otherSection: {
        backgroundColor: '#ffffff',
        padding: 16,
        marginTop: 16,
        elevation: 2,
    },
    otherItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    otherText: {
        fontSize: 14,
    },
    otherCount: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    accountSection: {
        backgroundColor: '#ffffff',
        padding: 16,
        marginTop: 16,
        elevation: 2,
    },
    accountItem: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    historySection: {
        backgroundColor: '#ffffff',
        padding: 16,
        marginTop: 16,
        elevation: 2,
    },
    historyText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    appointmentItem: {
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#d3d3d3',
    },
    noReviewItem: {
        borderColor: 'red', // review가 없을 때 테두리 색깔 변경
    },
    noReviewText: {
        marginTop: 5,
        color: 'red', // "리뷰 등록하기" 텍스트 색깔 설정
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
        borderRadius: 5,
    },
});

export default MyPage;
