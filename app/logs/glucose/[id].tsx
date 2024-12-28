import {
    View,
    Text,
    Alert,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import CustomText from "@/components/CustomText";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import CustomButton from "@/components/CustomButton";
import useGlucoseLog from "@/hooks/api/logs/glucose/useGlucoseLog";
import GlucoseLogForm from "./GlucoseLogForm";
import Wrapper from "@/components/Layout/Wrapper";
import CustomHeader from "@/components/CustomHeader";
import { Colors } from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { FlexStyles } from "@/constants/Flex";
import { isGlucoseDanger } from "@/utils/isGlucoseDanger";
import { useUserProfile } from "@/hooks/useUserProfile";
import CustomButtonNew from "@/components/CustomButtonNew";
import { useCustomAlert } from "@/app/context/CustomAlertProvider";

export default function GlucoseLogDetailPage() {
    const { id } = useLocalSearchParams();
    const { getGlucoseLogDetail, updateGlucoseLog, deleteGlucoseLog } =
        useGlucoseLog();
    const { profile } = useUserProfile();
    const { showAlert } = useCustomAlert()

    const [formValue, setFormValue] = useState<StoreGlucoseLogReq>({
        date: "",
        glucose_rate: 0,
        time: '',
        time_selection: '',
        notes: '',
        type: 'manual',
    })
    const [loading, setLoading] = useState(false)
    const [updateLoading, setUpdateLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const handleGetGlucoseLogDetail = async (id: number) => {
        try {
            const res = await getGlucoseLogDetail(setLoading, id);
            setFormValue(res.data);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const status = err.response?.status;

                if (status === 400) {
                    showAlert("Invalid request. Please check your input.", "error")
                } else if (status === 500) {
                    showAlert("A server error occurred. Please try again later.", "error")
                } else {
                    // showAlert(`An error occurred: ${status}. Please try again later.`, 'error');
                }
            } else {
                console.log("Unexpected Error:", err);
                showAlert("Please check your internet connection.", "error")
            }
        }
    };

    const handleUpdateGlucoseLog = async (payload: UpdateGlucoseLogReq) => {
        try {
            const res = await updateGlucoseLog(setUpdateLoading, payload)
            router.navigate('/(tabs)/(notes)')
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const status = err.response?.status;

                if (status === 400) {
                    showAlert("Invalid request. Please check your input.", "error")
                } else if (status === 500) {
                    showAlert("A server error occurred. Please try again later.", "error")
                } else {
                    // showAlert(`An error occurred: ${status}. Please try again later.`, 'error');
                }
            } else {
                console.log("Unexpected Error:", err);
                showAlert("Please check your internet connection.", "error")
            }
        }
    };

    const handleDeleteGlucoseLog = async (id: number) => {
        try {
            const res = await deleteGlucoseLog(setDeleteLoading, id)
            router.navigate('/(tabs)/(notes)')
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const status = err.response?.status;

                if (status === 400) {
                    showAlert("Invalid request. Please check your input.", "error")
                } else if (status === 500) {
                    showAlert("A server error occurred. Please try again later.", "error")
                } else {
                    // showAlert(`An error occurred: ${status}. Please try again later.`, 'error');
                }
            } else {
                console.log("Unexpected Error:", err);
                showAlert("Please check your internet connection.", "error")
            }
        }
    };

    useEffect(() => {
        handleGetGlucoseLogDetail(Number(id));
    }, []);

    return (
        <>
            <CustomHeader title="Edit log gula darah" />
            <Wrapper style={styles.container}>
                {isGlucoseDanger(
                    profile?.age ?? 0,
                    formValue.time_selection,
                    formValue.glucose_rate
                ) && (
                        <View style={styles.dangerTagContainer}>
                            <FontAwesome
                                name="warning"
                                color={Colors.light.red500}
                            />
                            <CustomText
                                size="sm"
                                style={{ color: Colors.light.red500 }}
                            >
                                Gula darahmu diluar batas normal
                            </CustomText>
                        </View>
                    )}
                {formValue.type == "auto" && (
                    <View style={styles.autoTagContainer}>
                        <CustomText
                            size="sm"
                            style={{ color: Colors.light.gray500 }}
                        >
                            Log diambil menggunakan alat
                        </CustomText>
                    </View>
                )}
                <GlucoseLogForm
                    formValue={formValue}
                    setFormValue={setFormValue}
                >
                    {({ handleSubmit, disabled }) => (
                        <View>
                            <CustomButton
                                title='Simpan perubahan'
                                size='md'
                                style={{ marginBottom: 10 }}
                                disabled={disabled || deleteLoading}
                                loading={updateLoading}
                                onPress={handleSubmit(data => handleUpdateGlucoseLog({
                                    id: Number(id),
                                    ...data,
                                }))}
                            />
                            <CustomButton
                                title='Hapus log'
                                size='md'
                                type="delete"
                                disabled={updateLoading}
                                loading={deleteLoading}
                                onPress={() => {
                                    showAlert('Apakah kamu ingin tetap melanjutkan untuk menghapus catatan ini', 'warning', () => { }, () => handleDeleteGlucoseLog(Number(id)))
                                }}
                            />
                        </View>
                    )}
                </GlucoseLogForm>
            </Wrapper>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: "white",
    },
    dangerTagContainer: {
        ...FlexStyles.flexRow,
        backgroundColor: Colors.light.red50,
        padding: 8,
        borderWidth: 1,
        borderColor: Colors.light.red500,
        borderRadius: 8,
        marginBottom: 8,
        gap: 4,
    },
    autoTagContainer: {
        ...FlexStyles.flexRow,
        backgroundColor: Colors.light.gray300,
        padding: 8,
        borderWidth: 1,
        borderColor: Colors.light.gray500,
        borderRadius: 8,
        gap: 4,
    },
});
