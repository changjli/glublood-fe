import { Text, TextInput, TextInputProps, View, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { cssInterop } from 'nativewind'

export type CustomTextInputProps = TextInputProps & {
    label?: string,
    placeholder?: string,
    classStyle?: string,
    error?: string,
}

export default function CustomTextInput({
    label,
    placeholder,
    classStyle,
    error,
    ...rest
}: CustomTextInputProps) {
    const isError = !!error;

    return (
        <View className={classStyle}>
            {label ?
                <Text style={ styles.headerTextInput }>
                    {label}
                </Text>
                : null
            }
            <TextInput
                style={[
                    styles.textInput,
                    {borderColor: isError ? 'red' : '#969696'},
                ]}
                placeholder={placeholder}
                placeholderTextColor="#969696"
                {...rest}
            />
            {
                isError ?
                    <View className='flex flex-row items-center gap-1'>
                        <Ionicons name='warning' size={16} color='red' />
                        <Text className='font-helvetica text-red-500'>
                            {error}
                        </Text>
                    </View>
                    : null
            }
        </View >
    )
}

export const StyledCustomTextInput = cssInterop(CustomTextInput, { style: true })

const styles = StyleSheet.create({
    headerTextInput: {
        marginVertical: 0,
        paddingVertical: 0,
        fontFamily: 'Helvetica-Bold',
        fontSize: 12,
    },
    textInput: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#969696',
        borderRadius: 8,
        fontFamily: 'Helvetica',
        fontSize: 16,
    },
    errorText: {
        marginLeft: 4,
        color: 'red',
        fontFamily: 'Helvetica',
    },
});