import { View, Text, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import EmailRequest from '@/app/forgot-password/email-request'
import VerifyCode from '@/app/forgot-password/verify-code'
import ResetPassword from '@/app/forgot-password/reset-password'
import SuccessPage from '@/app/forgot-password/success'
import { router } from 'expo-router'

export default function ForgorPassword() {
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
        if (page === 4) {
            const timer = setTimeout(() => {
                router.replace('/(auth)/login');
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [page, router]);

    const renderPage = () => {
        const pages: Record<number, JSX.Element> = {
            1: <EmailRequest setPage={setPage} setCredentials={setCredentials} />,
            2: <VerifyCode setPage={setPage} setCredentials={setCredentials} credentials={credentials} />,
            3: <ResetPassword setPage={setPage} credentials={credentials} />,
            4: <SuccessPage />,
        };

        return pages[page]
    };

    return <View style={{ flex: 1 }}>{renderPage()}</View>;
}