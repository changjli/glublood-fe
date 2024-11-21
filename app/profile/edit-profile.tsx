import { View, Text, Alert, TouchableWithoutFeedback, Keyboard, TouchableOpacity, StyleSheet, NativeSyntheticEvent, Pressable } from 'react-native'
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs';
import { Ionicons } from '@expo/vector-icons';
import useProfile from '@/hooks/api/profile/useProfile';
import { StyledCustomTextInput } from '@/components/CustomInput/CustomTextInput/userProfile';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { router } from 'expo-router';

interface FormValues {
    firstname: string;
    lastname: string;
    weight: number;
    height: number;
    age: number;
    DOB: Date;
    gender: string;
    is_descendant_diabetes: boolean;
    medical_history: string;
}

export default function editProfile() {
    const { fetchUserProfile, updateUserProfile } = useProfile()
    const [fetchLoading, setFetchLoading] = useState(false)
    const [updateLoading, setUpdateLoading] = useState(false)
    const [isAnyFieldTouched, setIsAnyFieldTouched] = useState(false);
    const [initialFormValues, setInitialFormValues] = useState({
        firstname: '',
        lastname: '',
        weight: '',
        height: '',
        age: '',
        birthDate: new Date(),
        gender: '',
        descendant: false,
        diseaseHistory: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetchUserProfile(setFetchLoading);
                if (res.status === 200) {
                    console.log("Fetch Data:", res.data);
                    setInitialFormValues({
                        firstname: res.data.firstname || '',
                        lastname: res.data.lastname || '',
                        weight: res.data.weight ? String(res.data.weight) : '',
                        height: res.data.height ? String(res.data.height) : '',
                        age: res.data.age ? String(res.data.age) : '',
                        birthDate: res.data.DOB ? new Date(res.data.DOB) : new Date(),
                        gender: res.data.gender ? String(res.data.gender) : '',
                        descendant: res.data.is_descendant_diabetes ? res.data.is_descendant_diabetes : false,
                        diseaseHistory: String(res.data.medical_history) || '',
                    });
                    Alert.alert('Success', res.message);
                } else if (res.status === 400) {
                    console.log(res.message);
                    Alert.alert('Error', res.message);
                }
            } catch (err) {
                console.log('Axios Error:', err);
                Alert.alert('Error', 'Please try again later');
            }
        };

        fetchData();
    }, []);

    const handleUpdateUserProfile = async (data: FormValues) => {
        try {
            const res = await updateUserProfile(setUpdateLoading, data)
            if (res.status == 200) {
                console.log("Update Data:", res.data)
                Alert.alert('success', res.message)
            } else if (res.status == 400) {
                console.log(res.message)
                Alert.alert('error', res.message)
            }
        } catch (err) {
            console.log('Axios Error:', err)
            Alert.alert('error', 'Error: Please try again later')
        }
    }

    const validationSchema = Yup.object().shape({
        firstname: Yup.string().required('Nama lengkap wajib diisi!'),
        lastname: Yup.string().required('Nama lengkap wajib diisi!'),
        weight: Yup.number().typeError('Wajib angka!').required('Berat badan wajib diisi!').positive().integer(),
        height: Yup.number().typeError('Wajib angka!').required('Tinggi badan wajib diisi!').positive().integer(),
        age: Yup.number().typeError('Wajib angka!').required('Usia wajib diisi!').positive().integer(),
        birthDate: Yup.date().required('Tanggal lahir wajib diisi!'),
        gender: Yup.string().required('Jenis Kelamin wajib diisi!'),
        descendant: Yup.string().required('Pertanyaan keturunan wajib diisi!'),
        diseaseHistory: Yup.string().required('Riwayat Penyakit wajib diis!'),
    });

    const [gender, setGender] = useState('');
    const [descendant, setDescendant] = useState<boolean | undefined>(undefined);
    
    const [openDatePicker, setOpenDatePicker] = useState(false);
    const [date, setDate] = useState(new Date());

    const [focus, setFocus] = useState(false);

    const handleOnPressDatePicker = () => {
        setOpenDatePicker(!openDatePicker)
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View
                className='mt-4'
                style={{ 
                    width: '100%',
                    height: '100%',
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                    display: 'flex',
                    backgroundColor: '#FFF8E1',
                }}
            >
                <Text style={styles.title}>Edit Profil</Text>
                <Text style={styles.subTitle}>Perubahan data diri terkait akunmu</Text>
                <Formik
                    enableReinitialize={true}
                    initialValues={initialFormValues}
                    validationSchema={validationSchema}
                    onSubmit={async (values) => {
                        const mappedValues: FormValues = {
                            firstname: values.firstname,
                            lastname: values.lastname,
                            weight: Number(values.weight),
                            height: Number(values.height),
                            age: Number(values.age),
                            DOB: new Date(values.birthDate),
                            gender: values.gender,
                            is_descendant_diabetes: values.descendant,
                            medical_history: values.diseaseHistory,
                        };

                        await handleUpdateUserProfile(mappedValues);

                        router.back();
                    }}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, setFieldValue }) => (
                        <View>
                            <View className="mb-2 flex-row justify-between">
                                <StyledCustomTextInput
                                    classStyle='mr-2 flex-1'
                                    label='Nama depan'
                                    placeholder='Type something here'
                                    value={values.firstname}
                                    onChangeText={handleChange('firstname')}
                                    onFocus={() => setIsAnyFieldTouched(true)}
                                    error={errors.firstname}
                                />
                                <StyledCustomTextInput
                                    classStyle='ml-2 flex-1'
                                    label='Nama belakang'
                                    placeholder='Type something here'
                                    value={values.lastname}
                                    onChangeText={handleChange('lastname')}
                                    onFocus={() => setIsAnyFieldTouched(true)}
                                    error={errors.lastname}
                                />
                            </View>
                            <View className="mb-2 flex-row justify-between">
                                <StyledCustomTextInput
                                    classStyle='mr-2 flex-1'
                                    label='Berat Badan'
                                    placeholder='Dalam Kg'
                                    value={values.weight}
                                    onChangeText={handleChange('weight')}
                                    onFocus={() => setIsAnyFieldTouched(true)}
                                    error={errors.weight}
                                />
                                <StyledCustomTextInput
                                    classStyle='ml-2 flex-1'
                                    label='Tinggi Badan'
                                    placeholder='Dalam Cm'
                                    value={values.height}
                                    onChangeText={handleChange('height')}
                                    onFocus={() => setIsAnyFieldTouched(true)}
                                    error={errors.height}
                                />
                            </View>
                            <View className="mb-2 flex-row justify-between">
                                <StyledCustomTextInput
                                    classStyle='mr-2 flex-1'
                                    label='Usia'
                                    placeholder='Tahun'
                                    value={values.age}
                                    onChangeText={handleChange('age')}
                                    onFocus={() => setIsAnyFieldTouched(true)}
                                    error={errors.age}
                                />
                                <View className='ml-2 flex-1'>
                                    <Text
                                        style = {{ 
                                            fontSize: 12,
                                            fontFamily: 'Helvetica-Bold'
                                        }}
                                    >
                                        Tanggal Lahir
                                    </Text>
                                    <Pressable
                                        style={{ 
                                            width: '100%',
                                            paddingHorizontal: 14,
                                            paddingVertical: 10,
                                            borderWidth: 1,
                                            borderRadius: 8,
                                            borderColor: errors.birthDate ? 'red' : '#969696',
                                        }}
                                        onPress={handleOnPressDatePicker}
                                        onFocus={() => setIsAnyFieldTouched(true)}
                                    >
                                        <Text
                                            style={{ 
                                                fontFamily: 'Helvetica',
                                                fontSize: 16,
                                            }}
                                        >
                                            {dayjs(values.birthDate).format('DD/MM/YYYY')}
                                        </Text>
                                    </Pressable>
                                </View>
                            </View>
                            <View className="mb-4">
                                <Text style={styles.headerTextInput} >Apakah Anda memiliki keturunan dengan riwayat penyakit diabetes?</Text>
                                <View className="flex-row justify-between">
                                    <TouchableOpacity
                                        style={[
                                            styles.selectionButton,
                                            { marginRight: 8 },
                                            { backgroundColor: values.gender === 'male' ? '#EC8F5E' : 'transparent' },
                                        ]}
                                        onPress={() => {
                                            setGender('male');
                                            setFieldValue('gender', 'male');
                                            setIsAnyFieldTouched(true);
                                        }}
                                    >
                                        <Text
                                            className="text-sm font-helvetica-bold text-center"
                                            style={{
                                                color: values.gender === 'male' ? '#ffffff' : '#EC8F5E'
                                            }}
                                        >
                                            Pria
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            styles.selectionButton,
                                            { marginRight: 8 },
                                            { backgroundColor: values.gender === 'female' ? '#EC8F5E' : 'transparent' },
                                        ]}
                                        onPress={() => {
                                            setGender('female');
                                            setFieldValue('gender', 'female');
                                            setIsAnyFieldTouched(true);
                                        }}
                                    >
                                        <Text
                                            className="text-sm font-helvetica-bold text-center"
                                            style={{
                                                color: values.gender === 'female' ? '#ffffff' : '#EC8F5E'
                                            }}
                                        >
                                            Wanita
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View className="mb-4">
                                <Text style={styles.headerTextInput} >Apakah Anda memiliki keturunan dengan riwayat penyakit diabetes?</Text>
                                <View className="flex-row justify-between">
                                    <TouchableOpacity
                                        style={[
                                            styles.selectionButton,
                                            { marginRight: 8 },
                                            { backgroundColor: values.descendant ? '#EC8F5E' : 'transparent' },
                                        ]}
                                        onPress={() => {
                                            setDescendant(true);
                                            setFieldValue('descendant', true);
                                            setIsAnyFieldTouched(true);
                                        }}
                                    >
                                        <Text
                                            className="text-sm font-helvetica-bold text-center"
                                            style={{
                                                color: values.descendant ? '#ffffff' : '#EC8F5E'
                                            }}
                                        >
                                            Yes
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            styles.selectionButton,
                                            { marginLeft: 8 },
                                            { backgroundColor: values.descendant ? 'transparent' : '#EC8F5E' },
                                        ]}
                                        onPress={() => {
                                            setDescendant(false);
                                            setFieldValue('descendant', false);
                                            setIsAnyFieldTouched(true);
                                        }}
                                    >
                                        <Text
                                            className="text-sm font-helvetica-bold text-center"
                                            style={{
                                                color: values.descendant ? '#EC8F5E' : '#ffffff'
                                            }}
                                        >
                                            No
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <StyledCustomTextInput
                                label='Riwayat Penyakit'
                                placeholder='Cth: Kolesterol'
                                value={values.diseaseHistory}
                                onChangeText={handleChange('diseaseHistory')}
                                onFocus={() => setIsAnyFieldTouched(true)}
                                error={errors.diseaseHistory}
                            />
                            <TouchableOpacity
                                style={{
                                    marginTop: 20,
                                    backgroundColor: isAnyFieldTouched ? '#EC8F5E' : '#F4C687',
                                    borderRadius: 10,
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                                onPress={() => handleSubmit()}
                            >
                                <Text
                                    style={{ 
                                        paddingVertical: 10,
                                        color: isAnyFieldTouched ? 'white' : '#D8D8D8',
                                        fontSize: 20,
                                        fontFamily: 'Helvetica-Bold',
                                    }}
                                >
                                    Simpan perubahan
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    marginTop: 5,
                                    borderRadius: 10,
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <Text
                                    style={{ 
                                        paddingVertical: 10,
                                        color: '#DA6E35',
                                        fontSize: 20,
                                        fontFamily: 'Helvetica-Bold',
                                    }}
                                    onPress={() => router.back()}
                                >
                                    Batalkan
                                </Text>
                            </TouchableOpacity>
                            {openDatePicker ? 
                                <DateTimePicker
                                    value={values.birthDate? values.birthDate : date}
                                    mode="date"
                                    display="spinner"
                                    minimumDate={new Date(1900, 1, 1)}
                                    maximumDate={new Date()}
                                    onChange={(event, selectedDate) => {
                                        handleOnPressDatePicker()
                                        if (selectedDate) {
                                            const dateFormat: string = dayjs(selectedDate).format('DD/MM/YYYY'); 
                                            console.log(dateFormat); 
                                            setFieldValue('birthDate', selectedDate);
                                            setIsAnyFieldTouched(true);
                                        }
                                    }}
                                />
                                :
                                null
                            }
                        </View>
                    )}
                </Formik>
            </View>
        </TouchableWithoutFeedback>
    )
}
 
const styles = StyleSheet.create({
    title: {
        marginBottom: -10,
        fontSize: 32,
        fontFamily: 'Helvetica-Bold',
    },
    subTitle: {
        marginBottom: 14,
        color: '#969696',
        fontSize: 14,
        fontFamily: 'Helvetica',
    },
    headerTextInput: {
        marginVertical: 0,
        paddingVertical: 0,
        fontFamily: 'Helvetica-Bold',
        fontSize: 12,
    },
    selectionButton: {
        height: 30,
        borderWidth: 1,
        borderColor: '#EC8F5E',
        borderRadius: 5,
        flex: 1,
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectionButtonText: {
        color: '#EC8F5E',
        fontSize: 18,
        fontFamily: 'Helvetica-Bold',
        textAlign: 'center',
    },
    centeredView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modal: {
        margin: 20,
        padding: 25,
        width: '90%',
        backgroundColor: '#F5FCFF',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
    }
});