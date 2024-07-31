import { View, Text, Keyboard } from 'react-native'
import React, { useState } from 'react'
import SendCode from './send-code'
import { TouchableWithoutFeedback } from 'react-native'
import VerifyCode from './verify-code'

export default function Register() {

    const [page, setPage] = useState<number>(1)

    const [credentials, setCredentials] = useState<{
        email: string,
        password: string,
    }>({
        email: '',
        password: '',
    })

    return (
        <>
            {page == 1 ?
                <SendCode setPage={setPage} setCredentials={setCredentials} />
                : <VerifyCode credentials={credentials} />
            }

        </>
    )
}