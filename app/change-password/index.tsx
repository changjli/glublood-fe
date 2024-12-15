import { View, Text, Keyboard, Alert, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import PasswordRequest from '@/app/change-password/password-request'
import VerifyCode from '@/app/change-password/verify-code'
import { router } from 'expo-router'
import { useSession } from '../context/AuthenticationProvider'
import SuccessChangePasswordPage from './success'

export default function ChangePassword() {
    const { signOut } = useSession();
    const [page, setPage] = useState<number>(1)

    const [credentials, setCredentials] = useState<{
        email: string,
        password: string,
        code: string,
    }>({
        email: '',
        password: '',
        code: '',
    })

    useEffect(() => {
        if (page === 3) {
            const timer = setTimeout(() => {
                router.replace('/profile/');
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [page]);

    const renderPage = () => {
        const pages: Record<number, JSX.Element> = {
            1: <PasswordRequest setPage={setPage} setCredentials={setCredentials} />,
            2: <VerifyCode setPage={setPage} credentials={credentials} />,
            3: <SuccessChangePasswordPage />
        };

        return pages[page]
    };

    return <View style={{ flex: 1 }}>{renderPage()}</View>;
}