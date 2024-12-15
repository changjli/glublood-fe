import { View, Text } from 'react-native'
import React from 'react'
import { FontFamily } from '@/constants/Typography'
import { useUserProfile } from '@/hooks/useUserProfile'
import { Colors } from '@/constants/Colors';

interface AvatarProps {
    name: string,
    size: number,
}

export default function Avatar({ name, size }: AvatarProps) {

    const getInitials = (name: string) => {
        if (!name) return '';
        const parts = name.trim().split(' ');
        return parts.length === 1
            ? parts[0].charAt(0).toUpperCase()
            : `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
    };

    return (
        <View style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.light.darkOrange50
        }}>
            <Text style={{
                fontFamily: FontFamily.heavy,
                color: Colors.light.primary,
                fontSize: size / 4
            }}>
                {getInitials(name)}
            </Text>
        </View>
    )
}