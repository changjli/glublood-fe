import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import useProfile from '@/hooks/api/profile/useProfile';
import * as Yup from "yup";
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import WithKeyboard from '@/components/Layout/WithKeyboard';
import CustomText from '@/components/CustomText';
import { Colors } from '@/constants/Colors';
import Wrapper from '@/components/Layout/Wrapper';
import CustomTextInput from '@/components/CustomInput/CustomTextInput';
import { FlexStyles } from '@/constants/Flex';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomCalendarPicker from '@/components/CustomCalendarPicker';
import CustomButton from '@/components/CustomButton';

export type UserProfileRequest = {
    name: string,
    weight: number,
    height: number,
    DOB: string,
    gender: string,
    is_descendant_diabetes: boolean,
    is_diabetes: boolean,
    medical_history: string,
    diabetes_type: number,
}

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Nama depan wajib diisi!"),
    weight: Yup.number()
        .typeError("Wajib angka!")
        .required("Berat badan wajib diisi!")
        .positive()
        .integer(),
    height: Yup.number()
        .typeError("Wajib angka!")
        .required("Tinggi badan wajib diisi!")
        .positive()
        .integer(),
    DOB: Yup.date().required("Tanggal lahir wajib diisi!"),
    gender: Yup.string().required("Jenis Kelamin wajib diisi!"),
    is_descendant_diabetes: Yup.bool().required("Pertanyaan keturunan wajib diisi!"),
    medical_history: Yup.string().required("Riwayat Penyakit wajib diis!"),
    is_diabetes: Yup.bool().required("Wajib diisi!"),
    diabetes_type: Yup.number().when("selectPatient", {
        is: 1,
        then: (schema) => schema.required("Wajib diisi!"),
        otherwise: (schema) => schema,
    }),
});

export default function CreateProfilePage() {
    const { storeUserProfile } = useProfile();
    const [storeLoading, setStoreLoading] = useState(false);
    const [formValue, setFormValue] = useState<UserProfileRequest>({
        name: '',
        weight: 0,
        height: 0,
        DOB: '',
        gender: '',
        medical_history: '',
        is_descendant_diabetes: false,
        is_diabetes: false,
        diabetes_type: 0,
    })
    const [step, setStep] = useState(0)

    const { control, handleSubmit, reset, watch, setValue, formState: { errors, isDirty, isValid } } = useForm<UserProfileRequest>({
        defaultValues: formValue,
        resolver: yupResolver(validationSchema),
        mode: 'onChange',
    })

    return (
        <WithKeyboard>
            {step == 0 && (
                <Wrapper>
                    <CustomText size='2xl' weight='heavy'>Kelengkapan data diri</CustomText>
                    <CustomText style={{ color: Colors.light.gray400 }}>Berkaitan dengan informasi pribadi anda</CustomText>

                    <Controller
                        control={control}
                        name='name'
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                            <CustomTextInput
                                label="Nama Lengkap"
                                placeholder="Contoh: John Doe"
                                value={value}
                                onChangeText={onChange}
                                error={errors.name ? errors.name.message : ''}
                            />
                        )}
                    />
                    <View style={[FlexStyles.flexRow, { gap: 4 }]}>
                        <Controller
                            control={control}
                            name='weight'
                            render={({ field: { onChange, onBlur, value, ref } }) => (
                                <View style={{ flexGrow: 1 }}>
                                    <CustomTextInput
                                        label="Berat Badan"
                                        placeholder="Dalam Kg"
                                        value={String(value)}
                                        onChangeText={onChange}
                                        error={errors.weight ? errors.weight.message : ''}
                                    />
                                </View>
                            )}
                        />

                        <Controller
                            control={control}
                            name='height'
                            render={({ field: { onChange, onBlur, value, ref } }) => (
                                <View style={{ flexGrow: 1 }}>
                                    <CustomTextInput
                                        label="Tinggi Badan"
                                        placeholder="Dalam Cm"
                                        value={String(value)}
                                        onChangeText={onChange}
                                        error={errors.height ? errors.height.message : ''}
                                    />
                                </View>
                            )}
                        />
                    </View>

                    <Controller
                        control={control}
                        name='DOB'
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                            <TouchableOpacity>
                                <CustomCalendarPicker
                                    value={value}
                                    setValue={onChange}
                                    enableRangeInput={false}
                                />
                            </TouchableOpacity>
                        )}
                    />

                    <Controller
                        control={control}
                        name='gender'
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                            <View style={[FlexStyles.flexRow, { gap: 4 }]}>
                                <CustomButton title='Pria' />
                                <CustomButton title='wanita' />
                            </View>
                        )}
                    />

                </Wrapper>
            )}
        </WithKeyboard>
    )
}