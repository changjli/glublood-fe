import { View, Text, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Keyboard, Image } from 'react-native'
import React, { useState } from 'react';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import CustomTextInput, { StyledCustomTextInput } from '@/components/CustomInput/CustomTextInput/userProfile'
import StepIndicator from 'react-native-step-indicator';
import { Ionicons } from '@expo/vector-icons';
import { useSession } from '../context/AuthenticationProvider'

export default function UserProfile() {

    const { session } = useSession()
    console.log(session)

    // Yup Validation
    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Nama lengkap wajib diisi!'),
        weight: Yup.number().typeError('Wajib angka!').required('Berat badan wajib diisi!').positive().integer(),
        height: Yup.number().typeError('Wajib angka!').required('Tinggi badan wajib diisi!').positive().integer(),
        age: Yup.number().typeError('Wajib angka!').required('Usia wajib diisi!').positive().integer(),
        birthDate: Yup.date().required('Tanggal lahir wajib diisi!').nullable(),
        gender: Yup.string().required('Jenis Kelamin wajib diisi!'),
        descendant: Yup.number().required('Pertanyaan keturunan wajib diisi!'),
        diseaseHistory: Yup.string().required('Riwayat Penyakit wajib diis!'),
    });

    const validationSchemaPage2 = Yup.object({
        selectPatient: Yup.number().required('Wajib diisi!'),
    });

    const validationSchemaPage3 = Yup.object({
        selectDiabetesType: Yup.number().required('Wajib diisi!'),
    });

    // Stepindicator state
    const [currentPosition, setCurrentPosition] = useState(0);
    const movePosition = (step) => {
        setCurrentPosition(prevPosition => {
            const newPosition = prevPosition + step;
            return newPosition < 0 ? 0 : newPosition > 3 ? 3 : newPosition;
        });
    };

    // Selection button state (gender)
    const [gender, setGender] = useState('');
    const isGender = [
        { label: 'Pria', value: 'pria' },
        { label: 'Wanita', value: 'wanita' },
    ]

    // Selection button state (descendant)
    const [descendant, setDescendant] = useState('');
    const isDescendant = [
        { label: 'Yes', value: 1 },
        { label: 'No', value: 0 },
    ]

    // Selection button state (Diabetes Patient)
    const [selectedPatient, setSelectedPatient] = useState('');

    // Selection button state (Diabetes Type)
    const [selectedDiabetesType, setSelectedDiabetesType] = useState('');

    const handleLogin = async (data) => {
        try {
            const res = await login(setLoginLoading, data)
            if (res.status == 200) {
                console.log(res.data)
                Alert.alert('success', res.message)
                signIn(res)
                router.replace('/')
            } else if (res.status == 400) {
                console.log(res.message)
                Alert.alert('error', res.message)
            }
        } catch (err) {
            console.log('Axios Error:', err)
            Alert.alert('error', 'Error: Please try again later')
        }
    }

    // UserProfile Pages (Personalization 1, 2, 3)
    const renderContent = () => {
        switch (currentPosition) {
            case 0:
                return (
                    <View className='mt-4'>
                        <Text style={styles.title}>Kelengkapan{'\n'}Data Diri</Text>
                        <Text style={styles.subTitle}>Berkaitan dengan informasi pribadi Anda</Text>
                        <Formik
                            initialValues={{
                                name: '',
                                weight: '',
                                height: '',
                                age: '',
                                birthDate: '',
                                gender: '',
                                descendant: '',
                                diseaseHistory: '',
                            }}
                            validationSchema={validationSchema}
                            onSubmit={values => {
                                console.log(values);
                            }}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                                <View>
                                    <StyledCustomTextInput
                                        classStyle='mb-2'
                                        label='Nama lengkap'
                                        placeholder='Type something here'
                                        value={values.name}
                                        onChangeText={handleChange('name')}
                                        error={errors.name}
                                    />
                                    <View className="mb-2 flex-row justify-between">
                                        <StyledCustomTextInput
                                            classStyle='mr-2 flex-1'
                                            label='Berat Badan'
                                            placeholder='Dalam Kg'
                                            value={values.weight}
                                            onChangeText={handleChange('weight')}
                                            error={errors.weight}
                                        />
                                        <StyledCustomTextInput
                                            classStyle='ml-2 flex-1'
                                            label='Tinggi Badan'
                                            placeholder='Dalam Cm'
                                            value={values.height}
                                            onChangeText={handleChange('height')}
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
                                            error={errors.age}
                                        />
                                        <StyledCustomTextInput
                                            classStyle='ml-2 flex-1'
                                            label='Tanggal lahir'
                                            placeholder='DD/MM/YYYY'
                                            value={values.birthDate}
                                            onChangeText={handleChange('birthDate')}
                                            error={errors.birthDate}
                                        />
                                    </View>
                                    <View className="mb-4">
                                        <Text style={styles.headerTextInput} >Jenis Kelamin</Text>
                                        <View className="flex-row justify-between">
                                            {isGender.map((item, index) => (
                                                <TouchableOpacity
                                                    key={item.value}
                                                    style={[
                                                        styles.selectionButton,
                                                        { marginRight: index === 0 ? 8 : '' },
                                                        { marginLeft: index === 1 ? 8 : '' },
                                                        { backgroundColor: gender === item.value ? '#EC8F5E' : 'transparent' },
                                                    ]}
                                                    onPress={() => {
                                                        setGender(item.value)
                                                        setFieldValue('gender', item.value)
                                                    }}
                                                >
                                                    <Text
                                                        className="text-sm font-helvetica-bold text-center"
                                                        style={{
                                                            color: gender === item.value ? '#ffffff' : '#EC8F5E'
                                                        }}
                                                    >
                                                        {item.label}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                        {errors.gender &&
                                            <View className='flex flex-row items-center gap-1'>
                                                <Ionicons name='warning' size={16} color='red' />
                                                <Text className='font-helvetica text-red-500'>
                                                    {errors.gender}
                                                </Text>
                                            </View>
                                        }
                                    </View>
                                    <View className="mb-4">
                                        <Text style={styles.headerTextInput} >Apakah Anda memiliki keturunan dengan riwayat penyakit diabetes?</Text>
                                        <View className="flex-row justify-between">
                                            {isDescendant.map((item, index) => (
                                                <TouchableOpacity
                                                    key={item.value}
                                                    style={[
                                                        styles.selectionButton,
                                                        { marginRight: index === 0 ? 8 : '' },
                                                        { marginLeft: index === 1 ? 8 : '' },
                                                        { backgroundColor: descendant === item.value ? '#EC8F5E' : 'transparent' },
                                                    ]}
                                                    onPress={() => {
                                                        setDescendant(item.value)
                                                        setFieldValue('descendant', item.value)
                                                    }}
                                                >
                                                    <Text
                                                        className="text-sm font-helvetica-bold text-center"
                                                        style={{
                                                            color: descendant === item.value ? '#ffffff' : '#EC8F5E'
                                                        }}
                                                    >
                                                        {item.label}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                        {errors.descendant &&
                                            <View className='flex flex-row items-center gap-1'>
                                                <Ionicons name='warning' size={16} color='red' />
                                                <Text className='font-helvetica text-red-500'>
                                                    {errors.descendant}
                                                </Text>
                                            </View>
                                        }
                                    </View>
                                    <StyledCustomTextInput
                                        label='Riwayat Penyakit'
                                        placeholder='Cth: Kolesterol'
                                        value={values.diseaseHistory}
                                        onChangeText={handleChange('diseaseHistory')}
                                        error={errors.diseaseHistory}
                                    />
                                </View>
                            )}
                        </Formik>
                    </View>
                );
            case 1:
                return (
                    <View className='mt-4'>
                        <Text style={styles.title}>Apakah Anda{'\n'}terkena diabetes?</Text>
                        <Text style={styles.subTitle}>Pilih yang sesuai dirimu</Text>
                        <Formik
                            initialValues={{ selectPatient: '' }}
                            validationSchema={validationSchemaPage2}
                            onSubmit={values => {
                                console.log(values);
                            }}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                                <View>
                                    <TouchableOpacity
                                        style={[
                                            { marginBottom: 25 },
                                            styles.selectionButtonType2,
                                            { backgroundColor: selectedPatient === 1 ? '#EC8F5E' : 'transparent' },
                                        ]}
                                        onPress={() => {
                                            setSelectedPatient(1);
                                            setFieldValue('selectPatient', 1);
                                        }}
                                    >
                                        <Image
                                            source={require('@/assets/svgs/userProfile/KarakterRisk.png')}
                                            style={{
                                                width: 100,
                                                height: 100,
                                                resizeMode: 'contain',
                                            }}
                                        />
                                        <Text
                                            className="text-md font-helvetica-bold text-center text-primary"
                                            style={{ color: selectedPatient === 1 ? '#ffffff' : '#EC8F5E' }}
                                        >
                                            Pasien Diabetes
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            styles.selectionButtonType2,
                                            { backgroundColor: selectedPatient === 0 ? '#EC8F5E' : 'transparent' },
                                        ]}
                                        onPress={() => {
                                            setSelectedPatient(0);
                                            setFieldValue('selectPatient', 0);
                                        }}
                                    >
                                        <Image
                                            source={require('@/assets/svgs/userProfile/KarakterSehat.png')}
                                            style={{
                                                width: 100,
                                                height: 100,
                                                resizeMode: 'contain',
                                            }}
                                        />
                                        <Text
                                            className="text-md font-helvetica-bold text-center text-primary"
                                            style={{ color: selectedPatient === 0 ? '#ffffff' : '#EC8F5E' }}
                                        >
                                            Pasien Non-Diabetes
                                        </Text>
                                    </TouchableOpacity>
                                    {errors.selectPatient &&
                                        <View className='flex flex-row items-center gap-1'>
                                            <Ionicons name='warning' size={16} color='red' />
                                            <Text className='font-helvetica text-red-500'>
                                                {errors.selectPatient}
                                            </Text>
                                        </View>
                                    }
                                    <TouchableOpacity onPress={() => handleSubmit()}>
                                        <Text>Submit</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </Formik>
                    </View>
                );
            case 2:
                return (
                    <View className='mt-4'>
                        <Text style={styles.title}>Diabetes apa yang{'\n'}diidap Anda?</Text>
                        <Text style={styles.subTitle}>Berkaitan dengan informasi pribadi Anda</Text>
                        <Formik
                            initialValues={{ selectDiabetesType: '' }}
                            validationSchema={validationSchemaPage3}
                            onSubmit={values => {
                                console.log(values);
                            }}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                                <View className='mt-6'>
                                    <TouchableOpacity
                                        style={[
                                            styles.selectionButtonType3,
                                            { backgroundColor: selectedDiabetesType === 1 ? '#EC8F5E' : 'transparent' },
                                        ]}
                                        onPress={() => {
                                            setSelectedDiabetesType(1);
                                            setFieldValue('selectDiabetesType', 1);
                                        }}
                                    >
                                        <Text
                                            className="text-[18px] font-helvetica-bold text-center text-primary"
                                            style={{ color: selectedDiabetesType === 1 ? '#ffffff' : '#EC8F5E' }}
                                        >
                                            Diabetes tipe 1
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            styles.selectionButtonType3,
                                            { backgroundColor: selectedDiabetesType === 2 ? '#EC8F5E' : 'transparent' },
                                        ]}
                                        onPress={() => {
                                            setSelectedDiabetesType(2);
                                            setFieldValue('selectDiabetesType', 2);
                                        }}
                                    >
                                        <Text
                                            className="text-[18px] font-helvetica-bold text-center text-primary"
                                            style={{ color: selectedDiabetesType === 2 ? '#ffffff' : '#EC8F5E' }}
                                        >
                                            Diabetes tipe 2
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            styles.selectionButtonType3,
                                            { backgroundColor: selectedDiabetesType === 3 ? '#EC8F5E' : 'transparent' },
                                        ]}
                                        onPress={() => {
                                            setSelectedDiabetesType(3);
                                            setFieldValue('selectDiabetesType', 3);
                                        }}
                                    >
                                        <Text
                                            className="text-[18px] font-helvetica-bold text-center text-primary"
                                            style={{ color: selectedDiabetesType === 3 ? '#ffffff' : '#EC8F5E' }}
                                        >
                                            Diabetes tipe 3
                                        </Text>
                                    </TouchableOpacity>
                                    {errors.selectDiabetesType &&
                                        <View className='flex flex-row items-center gap-1'>
                                            <Ionicons name='warning' size={16} color='red' />
                                            <Text className='font-helvetica text-red-500'>
                                                {errors.selectDiabetesType}
                                            </Text>
                                        </View>
                                    }
                                    <TouchableOpacity onPress={() => handleSubmit()}>
                                        <Text>Submit</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </Formik>
                    </View>
                );
            default:
                return null;
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="px-8 py-16 bg-bg flex flex-1" style={{ height: '100%' }}>
                <StepIndicator
                    currentPosition={currentPosition}
                    customStyles={customStyles}
                    stepCount='3'
                />
                {renderContent()}
                <View
                    style={{
                        marginTop: 'auto',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                    }}
                >
                    <TouchableOpacity
                        style={styles.prevButton}
                        onPress={() => movePosition(-1)}
                    >
                        <Ionicons name="arrow-back" color='#DA6E35' size={24} className='text-center' />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.nextButton}
                        onPress={() => movePosition(1)}
                    >
                        <Ionicons name="arrow-forward" color='#ffffff' size={24} className='text-center' />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    title: {
        marginBottom: -5,
        fontSize: 32,
        fontFamily: ['Helvetica-Bold'],
    },
    subTitle: {
        marginBottom: 14,
        color: '#969696',
        fontSize: 14,
        fontFamily: ['Helvetica'],
    },
    headerTextInput: {
        marginVertical: 0,
        paddingVertical: 0,
        fontFamily: ['Helvetica-Bold'],
        fontSize: 12,
    },
    textInput: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#969696',
        borderRadius: 8,
        fontFamily: ['Helvetica'],
        fontSize: 16,
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
    selectionButtonType2: {
        paddingVertical: 20,
        height: 180,
        borderWidth: 3,
        borderColor: '#EC8F5E',
        borderRadius: 15,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectionButtonType3: {
        marginBottom: 20,
        paddingVertical: 15,
        borderWidth: 2,
        borderColor: '#EC8F5E',
        borderRadius: 12,
    },
    nextButton: {
        width: 55,
        height: 40,
        backgroundColor: '#DA6E35',
        borderRadius: 8,
        display: 'flex',
        justifyContent: 'center',
    },
    prevButton: {
        width: 55,
        height: 40,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#DA6E35',
        borderRadius: 8,
        display: 'flex',
        justifyContent: 'center',
    },
});

const customStyles = {
    stepIndicatorSize: 40,
    currentStepIndicatorSize: 40,
    stepStrokeWidth: 3.5,
    separatorStrokeWidth: 3.5,
    currentStepStrokeWidth: 3.5,
    stepStrokeCurrentColor: '#DA6E35',
    stepStrokeFinishedColor: '#DA6E35',
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: '#DA6E35',
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: '#DA6E35',
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    labelColor: '#999999',
    currentStepLabelColor: '#DA6E35',
    stepIndicatorLabelCurrentColor: '#DA6E35',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelSize: 14,
    stepIndicatorLabelFontSize: 14,
    currentStepIndicatorLabelFontSize: 14,
}