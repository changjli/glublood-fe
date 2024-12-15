import React from 'react';
import {
    View,
    Text,
    ImageBackground,
    ImageBackgroundProps,
    StyleSheet,
    TouchableOpacity,
    ImageSourcePropType,
} from 'react-native';
import { useNavigation } from 'expo-router';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { FontSize } from '@/constants/Typography';

export type DynamicTextComponentProps = ImageBackgroundProps & {
    text: string
    img: ImageSourcePropType
    back?: boolean
};

export default function DynamicTextComponent({
    text,
    img,
    back,
    ...rest
}: DynamicTextComponentProps) {
    const navigation = useNavigation()

    return (
        <ImageBackground
            source={img}
            style={styles.imgBackground}
            {...rest}
        >
            <View style={styles.container}>
                {back && (
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name='arrow-back' style={styles.iconStyle} />
                    </TouchableOpacity>
                )}
                <Text style={styles.textStyle}>{text}</Text>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    imgBackground: {
        width: '100%',
        height: 240,
    },
    container: {
        marginTop: 30,
        marginLeft: 20,
        display: 'flex',
        flexDirection: 'column'
    },
    iconStyle: {
        color: 'white',
        fontSize: FontSize['2xl'],
    },
    textStyle: {
        color: 'white',
        fontSize: FontSize.xl,
        fontFamily: 'Helvetica-Bold',
    },
})
