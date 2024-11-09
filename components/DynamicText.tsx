import React from 'react';
import {
    View,
    Text,
    ImageBackground,
    ImageBackgroundProps,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { useNavigation } from 'expo-router';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

export type DynamicTextComponentProps = ImageBackgroundProps & {
    text: string
    img: string
};

export default function DynamicTextComponent({
    text,
    img,
    ...rest
}: DynamicTextComponentProps) {
    const navigation = useNavigation()

    return (
        <ImageBackground
            source={require('@/assets/images/backgrounds/tracking-nutrisi.png')} // path to your image
            style={styles.imgBackground}
            {...rest}
        >
            <View style={styles.container}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name='arrow-back' style={styles.iconStyle} />
                </TouchableOpacity>
                <Text style={styles.textStyle}>Tracking</Text>
                <Text style={[styles.textStyle, { marginTop: -15 },]}>{text}</Text>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    imgBackground: {
        width: '100%',
        height: 260,
    },
    container: {
        marginTop: 50,
        marginLeft: 20,
        display: 'flex',
        flexDirection: 'column'
    },
    iconStyle: {
        color: 'white',
        fontSize: 24,
    },
    textStyle: {
        color: 'white',
        fontSize: 32,
        fontFamily: 'Helvetica-Bold',
    },
})
