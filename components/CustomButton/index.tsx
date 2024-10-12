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
} from "react-native";
import React, { useState } from "react";
import { tv } from "tailwind-variants";
import { cssInterop } from "nativewind";

export type CustomButtonProps = TouchableOpacityProps & {
    title: string;
    size?: "sm" | "md" | "lg";
    type?: "primary" | "outline";
    textStyle?: TextProps["style"];
    loading?: boolean;
};

export default function CustomButton({
    title,
    size,
    type,
    textStyle,
    loading,
    ...rest
}: CustomButtonProps) {
    return (
        <TouchableOpacity
            className={buttonStyles({
                size,
                type,
                disabled: rest.disabled!,
            })}
            {...rest}
        >
            {loading ? (
                <ActivityIndicator color="white" />
            ) : (
                <Text
                    style={textStyle}
                    className={textStyles({
                        size,
                        type,
                        disabled: rest.disabled!,
                    })}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
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
            true: "bg-secondary border-secondary",
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
