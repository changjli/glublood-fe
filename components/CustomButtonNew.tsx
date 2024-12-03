import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

export type CustomButtonNewProps = TouchableOpacityProps & {
    store: boolean,
    imgSrc?: void,
    label: string,
};

export default function CustomButtonNew({
    store,
    imgSrc,
    label,
    ...rest
}:CustomButtonNewProps ) {
    return (
        imgSrc?
            <TouchableOpacity
                style={[
                    styles.container,
                    { backgroundColor: store? rest.disabled! ? '#D8D8D8' : '#DA6E35' : rest.disabled! ? '#D8D8D8' : 'transparent' }
                ]}
                {...rest}
            >
                <Image
                    source={imgSrc}
                    style={[
                        styles.icon,
                        { opacity: rest.disabled! ? 0.3 : 1 },
                        { tintColor: store? 'white' : '#FE3F11' }
                    ]}
                />
                <Text
                    style={[ 
                        styles.text,
                        { opacity: rest.disabled! ? 0.4 : 1 },
                        { color: store? rest.disabled!? '#969696' : 'white' : rest.disabled!? '#969696' : '#FE3F11' },
                    ]}
                >
                    {label}
                </Text>
            </TouchableOpacity>
            :
            
            <TouchableOpacity
                style={[
                    styles.container,
                    {backgroundColor: rest.disabled!? '#D8D8D8' : '#DA6E35'}
                ]}
            >
                <Text
                    style={[ 
                        styles.text,
                        { opacity: rest.disabled! ? 0.4 : 1 },
                        { color: store? rest.disabled!? '#969696' : 'white' : rest.disabled!? '#969696' : '#FE3F11' },
                    ]}
                >
                    {label}
                </Text>
            </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 5,
        paddingVertical: 14,
        width: '100%',
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        marginRight: 8,
        width: 18,
        height: 18,
    },
    text: {
        fontSize: 20,
        fontFamily: 'Helvetica-Bold',
    }
});