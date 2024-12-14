import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';

const Personalization3_2 = () => {
    return (
        <View className='mt-4'>
            <Text style={styles.title}>Pengecekkan{'\n'}diabetes</Text>
            <Text style={styles.subTitle}>Yuk periksa indikasi kesehatanmu</Text>
            <View className='mt-4'>
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Image
                        source={require('@/assets/svgs/userProfile/KarakterPengecekkan.png')}
                        style={styles.img}
                    />
                    <Text
                        style={styles.text}
                    >
                        Pastikan Anda menjawabnya sesuai dengan yang sebenarnya, karena test akan mempengaruhi hasil Anda
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        marginBottom: -5,
        fontSize: 32,
        fontFamily: 'Helvetica-Bold',
    },
    subTitle: {
        marginBottom: 14,
        color: '#969696',
        fontSize: 14,
        fontFamily: 'Helvetica',
    },
    img: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
    text: {
        marginTop: 15,
        color: 'black',
        fontSize: 16,
        fontFamily: 'Helvetica',
        textAlign: 'center',
    },
});

export default Personalization3_2;
