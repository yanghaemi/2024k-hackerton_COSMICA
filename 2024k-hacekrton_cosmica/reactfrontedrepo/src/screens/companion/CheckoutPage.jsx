import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import WebView from 'react-native-webview';
import CheckBox from '@react-native-community/checkbox';

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = "sShn9vab2fI-6MsF53Nv2";

const CheckoutPage = () => {
    const [amount, setAmount] = useState({
        currency: "KRW",
        value: 50000,
    });
    const [ready, setReady] = useState(false);
    const [htmlContent, setHtmlContent] = useState('');
    const [webViewVisible, setWebViewVisible] = useState(true);
    const [couponChecked, setCouponChecked] = useState(false);

    useEffect(() => {
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <script src="https://js.tosspayments.com/v2/standard">
                 document.addEventListener('DOMContentLoaded', async function () {
                        const tossPayments = await loadTossPayments('${clientKey}');
                        const widgets = tossPayments.widgets({ customerKey: '${customerKey}' });

                        await widgets.setAmount({ currency: '${amount.currency}', value: ${amount.value} });

                        await Promise.all([
                            widgets.renderPaymentMethods({
                                selector: "#payment-method",
                                variantKey: "DEFAULT",
                            }),
                            widgets.renderAgreement({
                                selector: "#agreement",
                                variantKey: "AGREEMENT",
                            }),
                        ]);

                        document.getElementById('payment-button').onclick = async function () {
                            try {
                                await widgets.requestPayment({
                                    orderId: "WUoDgy8hBPk043i9YzG9H",
                                    orderName: "토스 티셔츠 외 2건",
                                    successUrl: window.location.origin + "/success",
                                    failUrl: window.location.origin + "/fail",
                                    customerEmail: "customer123@gmail.com",
                                    customerName: "김토스",
                                    customerMobilePhone: "01012341234",
                                });
                            } catch (error) {
                                console.error(error);
                            }
                        };

                        window.ReactNativeWebView.postMessage('READY');
                    });
            </script>

            </head>
            <body>
                <div id="payment-method"></div>
                <div id="agreement"></div>
                <button id="payment-button" style="margin-top: 30px;" disabled>결제하기</button>
            </body>
            </html>
        `;
        setHtmlContent(html);
    }, [amount]);

    const handleMessage = (event) => {
        if (event.nativeEvent.data === 'READY') {
            setReady(true);
            document.getElementById('payment-button').disabled = false;
        }
    };

    return (
        <View style={styles.container}>
            {webViewVisible && (
                <WebView
                    originWhitelist={['*']}
                    source={{ html: htmlContent }}
                    style={styles.webview}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    onMessage={handleMessage}
                />
            )}
            <View style={styles.checkboxContainer}>
                <CheckBox
                    value={couponChecked}
                    disabled={!ready}
                    onValueChange={(newValue) => {
                        setCouponChecked(newValue);
                        setAmount({
                            ...amount,
                            value: newValue ? amount.value - 5000 : amount.value + 5000,
                        });
                    }}
                />
                <Text style={styles.label}>5,000원 쿠폰 적용</Text>
            </View>
            <Button
                title="결제하기"
                disabled={!ready}
                onPress={() => setWebViewVisible(true)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    webview: {
        flex: 1,
        width: '100%',
    },
    checkboxContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    label: {
        margin: 8,
    },
});

export default CheckoutPage;
