import React from 'react';
import {
    View,
    Text,
    ImageBackground,
    TextProps,
    ImageBackgroundProps,
    StyleSheet,
} from 'react-native';
import { cssInterop } from 'nativewind';
import { tv } from 'tailwind-variants';

export type DynamicTextComponentProps = ImageBackgroundProps & {
    text: string;
};

export default function DynamicTextComponent({
    text,
    ...rest
}: DynamicTextComponentProps) {
    return (
        <ImageBackground
            source={require('@/assets/images/top-bg.png')} // path to your image
            style={styles.imgBackground}
            {...rest}
        >
            <View style={styles.container}>
                <Text style={styles.textStyle}>Tracking</Text>
                <Text style={[
                    styles.textStyle,
                    {marginTop: -15},
                ]}>
                    {text}
                </Text>
            </View>
        </ImageBackground>
    );
}

export const StyledDynamicTextComponent = cssInterop(DynamicTextComponent, {
    style: true,
    textStyle: true,
});

const styles = StyleSheet.create({
    container: {
        marginTop: 55,
        marginLeft: 20,
        display: 'flex',
        flexDirection: 'column'
    },
    imgBackground: {
        marginBottom: 20,
        width: '100%',
        height: 260,
        display: 'flex',
        flexDirection: 'row',
    },
    textStyle: {
        color: 'white',
        fontSize: 32,
        fontFamily: 'Helvetica-Bold',
    },
})
