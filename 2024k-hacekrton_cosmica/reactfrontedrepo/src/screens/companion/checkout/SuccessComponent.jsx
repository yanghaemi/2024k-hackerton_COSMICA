import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

export function SuccessPage() {
    const route = useRoute();
    const navigation = useNavigation();
    const [responseData, setResponseData] = useState(null);

    useEffect(() => {
        const confirm = async () => {
            const { orderId, amount, paymentKey } = route.params;

            const requestData = {
                orderId,
                amount,
                paymentKey,
            };

            try {
                const response = await fetch('/confirm', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestData),
                });

                const json = await response.json();

                if (!response.ok) {
                    throw { message: json.message, code: json.code };
                }

                setResponseData(json);
            } catch (error) {
                Alert.alert('Error', error.message);
                navigation.navigate('FailPage', { code: error.code, message: error.message });
            }
        };

        confirm();
    }, [route.params, navigation]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: 'https://static.toss.im/illusts/check-blue-spot-ending-frame.png' }}
                    style={styles.image}
                />
                <Text style={styles.header}>결제를 완료했어요</Text>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.label}>결제금액</Text>
                <Text style={styles.value}>{`${Number(route.params.amount).toLocaleString()}원`}</Text>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.label}>주문번호</Text>
                <Text style={styles.value}>{`${route.params.orderId}`}</Text>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.label}>paymentKey</Text>
                <Text style={styles.value}>{`${route.params.paymentKey}`}</Text>
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    title="연동 문서"
                    onPress={() => Linking.openURL('https://docs.tosspayments.com/guides/v2/payment-widget/integration')}
                />
                <Button
                    title="실시간 문의"
                    color="#1b64da"
                    onPress={() => Linking.openURL('https://discord.gg/A4fRFXQhRu')}
                />
            </View>
            <View style={styles.responseContainer}>
                <Text style={styles.responseLabel}>Response Data :</Text>
                <Text style={styles.response}>{responseData && JSON.stringify(responseData, null, 4)}</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    image: {
        width: 100,
        height: 100,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 16,
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    label: {
        fontWeight: 'bold',
    },
    value: {
        fontSize: 16,
    },
    buttonContainer: {
        marginVertical: 20,
    },
    responseContainer: {
        marginTop: 20,
    },
    responseLabel: {
        fontWeight: 'bold',
        marginBottom: 10,
    },
    response: {
        whiteSpace: 'pre-wrap', // For preformatted text display
    },
});
