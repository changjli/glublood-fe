import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from "react-native";
import React, { Children, useEffect, useState } from "react";
import { Formik, FormikProps } from "formik";
import * as Yup from "yup";
import CustomTextInput from "@/components/CustomInput/CustomTextInput";
import { FontFamily, FontSize } from "@/constants/Typography";
import { Colors } from "react-native/Libraries/NewAppScreen";
import CustomTimePicker from "@/components/CustomTimePicker";
import CustomQuantityPicker from "@/components/CustomQuantityPicker";
import { FlexStyles } from "@/constants/Flex";
import { Controller, useForm, UseFormHandleSubmit } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

interface GlucoseLogFormRenderProps {
    handleSubmit: UseFormHandleSubmit<StoreGlucoseLogReq, undefined>;
    disabled: boolean;
}

interface GlucoseLogFormProps {
    formValue: StoreGlucoseLogReq;
    setFormValue: (formValue: StoreGlucoseLogReq) => void;
    children: (props: GlucoseLogFormRenderProps) => React.ReactNode;
}

const glucoseLogSchema = Yup.object().shape({
    glucose_rate: Yup.number().required("Tekanan gula darah wajib diisi!"),
    time: Yup.string().required("Waktu pengambilan wajib diisi!"),
    time_selection: Yup.string(),
    notes: Yup.string(),
});

const doseTypes = ["Sesudah Makan", "Sebelum Makan", "Puasa", "Sebelum Tidur"];

export default function GlucoseLogForm({
    formValue,
    setFormValue,
    children,
    ...rest
}: GlucoseLogFormProps) {
    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isDirty, isValid },
    } = useForm<StoreGlucoseLogReq>({
        defaultValues: formValue,
        resolver: yupResolver(glucoseLogSchema),
        mode: "onChange",
    });

    useEffect(() => {
        reset(formValue);
    }, [formValue]);

    return (
        <View
            style={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "space-between",
            }}
        >
            <View>
                <Controller
                    control={control}
                    name="glucose_rate"
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                        <View style={{ marginBottom: 15 }}>
                            <CustomTextInput
                                label="Gula Darahmu"
                                placeholder="Contoh: 98"
                                postfix={
                                    <Text
                                        style={{
                                            fontFamily: FontFamily.heavy,
                                            fontSize: FontSize.md,
                                            color: "#DA6E35",
                                        }}
                                    >
                                        mg/dL
                                    </Text>
                                }
                                keyboardType="numeric"
                                value={String(value)}
                                onChangeText={onChange}
                                readOnly={formValue.type == "auto"}
                            />
                        </View>
                    )}
                />

                <Controller
                    control={control}
                    name="time"
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                        <View style={{ marginBottom: 15 }}>
                            <CustomTimePicker
                                value={value}
                                onChange={onChange}
                                label="Pilih waktu"
                            />
                        </View>
                    )}
                />

                <Controller
                    control={control}
                    name="time_selection"
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                        <View style={{ marginBottom: 15 }}>
                            <Text style={styles.labelText}>
                                Kondisi Pengambilan
                            </Text>
                            <CustomQuantityPicker
                                widthSize={200}
                                size={value}
                                onChangeSize={onChange}
                                sizeData={doseTypes}
                                showQty={false}
                            />
                        </View>
                    )}
                />

                <Controller
                    control={control}
                    name="notes"
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                        <CustomTextInput
                            style={styles.catatanInput}
                            label="Catatan"
                            placeholder="Masukkan catatan di bagian ini"
                            value={value}
                            onChangeText={onChange}
                        />
                    )}
                />
            </View>
            {children({ handleSubmit, disabled: !isDirty || !isValid })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#EAF3F4",
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#333",
    },
    input: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: "#fff",
    },
    labelText: {
        fontSize: 16,
        fontFamily: "Helvetica-Bold",
    },
    timePicker: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        backgroundColor: "#fff",
    },
    timeText: {
        fontSize: 16,
        color: "#333",
    },
    scrollablePickerContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    dosisContainer: {
        marginBottom: 20,
    },
    pickerLabel: {
        fontSize: 16,
        marginBottom: 5,
        color: "#333",
    },
    dosisPicker: {
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: "#fff",
        overflow: "hidden",
    },
    dosisPickerContent: {
        alignItems: "center",
    },
    dosisItem: {
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    dosisText: {
        fontSize: 18,
        color: "#DA6E35",
    },
    selectedDosisText: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#DA6E35",
    },
    unitButton: {
        backgroundColor: "#F4B084", // Button color as per screenshot
        padding: 10,
        borderRadius: 5,
    },
    unitText: {
        fontSize: 16,
        color: "#fff",
    },
    catatanInput: {
        height: 100,
        textAlignVertical: "top",
    },
    saveButton: {
        padding: 15,
        backgroundColor: "#DA6E35",
        borderRadius: 8,
        alignItems: "center",
    },
    saveButtonText: {
        color: "#fff",
        fontSize: 20,
        fontFamily: "Helvetica-Bold",
    },
});
