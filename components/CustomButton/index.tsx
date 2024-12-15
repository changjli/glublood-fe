import {
    ActivityIndicator,
    Pressable,
    PressableProps,
    Text,
    TextProps,
    TouchableOpacity,
    TouchableOpacityProps,
    View,
    Image,
    StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { tv } from "tailwind-variants";
import { cssInterop } from "nativewind";
import { Colors } from "@/constants/Colors";
import { FontFamily, FontSize } from "@/constants/Typography";
import { FontAwesome } from "@expo/vector-icons";

export type CustomButtonProps = TouchableOpacityProps & {
    title: string;
    size?: "sm" | "md" | "lg";
    type?: "primary" | "outline" | "delete";
    textStyle?: TextProps["style"];
    loading?: boolean;
};

export default function CustomButton({
    title,
    size = 'md',
    type = 'primary',
    textStyle,
    loading,
    disabled,
    style,
    ...rest
}: CustomButtonProps) {
    return (
        <TouchableOpacity
            style={[
                styles.buttonContainer,
                buttonSizeStyles[size],
                buttonTypeStyles[type],
                disabled && styles.buttonDisabled,
                style,
            ]}
            disabled={disabled}
            {...rest}
        >
            {type == 'delete' && (
                <FontAwesome name="trash" size={FontSize.md} color={Colors.light.red500} />
            )}
            {loading ? (
                <ActivityIndicator color="white" />
            ) : (
                <Text
                    style={[
                        styles.buttonText,
                        textSizeStyles[size],
                        textTypeStyles[type],
                        disabled && { color: Colors.light.gray300 },
                        textStyle
                    ]}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 2,
        borderColor: Colors.light.primary,
        gap: 8,
    },
    buttonSm: {
        paddingVertical: 3,
    },
    buttonMd: {
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    buttonLg: {
        paddingHorizontal: 30,
        paddingVertical: 16,
    },
    buttonPrimary: {
        backgroundColor: Colors.light.primary,
    },
    buttonOutline: {
        backgroundColor: 'white',
    },
    buttonDisabled: {
        backgroundColor: Colors.light.darkOrange50,
        borderColor: Colors.light.darkOrange50,
    },
    buttonDelete: {
        backgroundColor: 'white',
        borderWidth: 0,
    },
    buttonText: {
        fontFamily: FontFamily.heavy,
    },
})

const buttonSizeStyles = {
    sm: styles.buttonSm,
    md: styles.buttonMd,
    lg: styles.buttonLg,
}

const buttonTypeStyles = {
    primary: styles.buttonPrimary,
    outline: styles.buttonOutline,
    delete: styles.buttonDelete,
}

const textSizeStyles = {
    sm: { fontSize: FontSize.sm },
    md: { fontSize: FontSize.md },
    lg: { fontSize: FontSize.lg }
}

const textTypeStyles = {
    primary: { color: 'white' },
    outline: { color: Colors.light.primary },
    delete: { color: Colors.light.red500 },
}

export const StyledCustomButton = cssInterop(CustomButton, {
    style: true,
    textStyle: true,
});

const buttonStyles = tv({
    base: "flex justify-center items-center rounded-[8px]",
    variants: {
        size: {
            sm: "py-[3px]",
            md: "px-[24px] py-[12px]",
            lg: "px-[30px] py-[16px]",
        },
        type: {
            primary: "bg-primary border-2 border-primary",
            outline: "bg-transparent border-2 border-primary",
        },
        disabled: {
            true: "bg-darkOrange50 border-darkOrange50",
        },
    },
    defaultVariants: {
        size: "sm",
        type: "primary",
    },
});

const textStyles = tv({
    base: "font-helvetica-bold",
    variants: {
        size: {
            sm: "text-[12px]",
            md: "text-[16x]",
            lg: "text-[20px]",
        },
        type: {
            primary: "text-white",
            outline: "text-primary",
        },
        disabled: {
            true: "text-gray-300",
        },
    },
    defaultVariants: {
        size: "sm",
        type: "primary",
    },
});
