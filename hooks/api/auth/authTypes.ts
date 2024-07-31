export type loginRequest = {
    email: string,
    password: string,
}

export type registerRequest = {
    email: string,
    password: string,
    code: string,
}

export type sendCodeRequest = {
    email: string,
    password: string,
}

export type loginResponse = {
    data: {
        email: string
        id: number
        role: string
    }
    token: string
}
