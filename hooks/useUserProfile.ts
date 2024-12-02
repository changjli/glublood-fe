import { useEffect, useState } from "react";
import useProfile from "./api/profile/useProfile";
import axios from "axios";
import { useCustomAlert } from "@/app/context/CustomAlertProvider";

export type UserProfile = {
    DOB: string,
    age: number,
    diabetes_type: number,
    first_number: string,
    gender: string,
    height: string,
    is_descendant_diabetes: boolean,
    is_diabetes: false,
    lastname: string,
    medical_history: string,
    weight: string,
}

export function useUserProfile() {
    const { fetchUserProfile } = useProfile()
    const { showAlert } = useCustomAlert()

    const [profile, setProfile] = useState<UserProfile>()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        handleGetUserProfile()
    }, [])

    const handleGetUserProfile = async () => {
        try {
            const res = await fetchUserProfile(setLoading)
            setProfile(res.data)
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const status = err.response?.status;

                if (status === 400) {
                    showAlert('Invalid request. Please check your input.', 'error');
                } else if (status === 500) {
                    showAlert('A server error occurred. Please try again later.', 'error');
                } else {
                    // Alert.alert('Error', `An error occurred: ${status}. Please try again later.`);
                }
            } else {
                console.log('Unexpected Error:', err);
                showAlert('Please check your internet connection.', 'error');
            }
            return {}
        }
    }

    return {
        profile,
        loading,
    }
}