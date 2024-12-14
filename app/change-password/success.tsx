import { View, Text, Keyboard, Image, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";

export default function SuccessChangePasswordPage() {
    return (
        <TouchableOpacity style={{ height: "100%" }} onPress={() => router.replace('/profile/')}>
            <Image
                source={require("@/assets/images/forgot-password/success-top-bg.png")}
                style={[
                    styles.bg,
                    {
                        top: 0,
                        width: 412,
                        height: 202,
                    }
                ]}
            />
            <View style={styles.contentContainer}>
                <Image
                    source={require("@/assets/images/forgot-password/success.png")}
                    style={styles.img}
                />
                <Text style={styles.title}>Kata sandi berhasil diubah!</Text>
                <Text style={styles.subTitle}> Silahkan tap untuk kembali ke halaman profile</Text>
            </View>
            <Image
                source={require("@/assets/images/forgot-password/success-bottom-bg.png")}
                style={[
                    styles.bg,
                    { bottom: 0 }
                ]}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        margin: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bg: {
        position: "absolute",
        zIndex: -1,
        width: 412,
        height: 188,
        objectFit: "contain",
    },
    img: {
        marginLeft: -45,
        marginBottom: -5,
        width: 245,
        height: 265,
        objectFit: 'contain'
    },
    title: {
        color: '#DA6E35',
        fontSize: 24,
        fontFamily: 'Helvetica-Bold',
    },
    subTitle: {
        width: 280,
        color: '#969696',
        fontSize: 16,
        fontFamily: 'Helvetica',
        letterSpacing: 0.5,
        textAlign: 'center',
    }
});
