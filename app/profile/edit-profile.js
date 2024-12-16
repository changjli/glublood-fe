import { View, Text, Alert, TouchableWithoutFeedback, Keyboard, TouchableOpacity, StyleSheet, Image, Pressable, ScrollView } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs';
import { Ionicons } from '@expo/vector-icons';
import useProfile from '@/hooks/api/profile/useProfile';
import { StyledCustomTextInput } from '@/components/CustomInput/CustomTextInput/userProfile';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { router } from 'expo-router';

// Selection button state (gender)
const isGender = [
    { label: "Pria", value: "male" },
    { label: "Wanita", value: "female" },
];

// Selection button state (descendant)
const isDescendant = [
    { label: "Iya", value: true },
    { label: "Tidak", value: false },
];

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
        isDiabetes: false,
        diabetesType: 0,
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
                        weight: res.data.weight ? String(Math.floor(res.data.weight)) : '',
                        height: res.data.height ? String(Math.floor(res.data.height)) : '',
                        age: res.data.age ? res.data.age : '',
                        birthDate: res.data.DOB ? new Date(Date.parse(res.data.DOB)) : new Date(),
                        gender: res.data.gender ? res.data.gender : '',
                        descendant: res.data.is_descendant_diabetes ? res.data.is_descendant_diabetes : false,
                        diseaseHistory: res.data.medical_history || '',
                        isDiabetes: res.data.is_diabetes || '',
                        diabetesType: res.data.diabetes_type || '',
                    });
                    setDescendant(res.data.is_descendant_diabetes)
                    setGender(res.data.gender)
                    setIsDiabetes(res.data.is_diabetes)
                    setDiabetesType(res.data.diabetes_type)

                    // Alert.alert('Success', res.message);
                } else if (res.status === 400) {
                    console.log(res.message);
                    // Alert.alert('Error', res.message);
                }
            } catch (err) {
                console.log('Axios Error:', err);
                Alert.alert('Error', 'Please try again later');
            }
        };

        fetchData();
    }, []);

    const handleUpdateUserProfile = async (data) => {
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

    const validationSchema = Yup.object().shape({firstname: Yup.string().required("Nama lengkap wajib diisi!"),
        firstname: Yup.string().required("Nama lengkap wajib diisi!"),
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
        age: Yup.number().positive().integer(),
        birthDate: Yup.date().required("Tanggal lahir wajib diisi!").nullable(),
        gender: Yup.string().required("Jenis Kelamin wajib diisi!"),
        descendant: Yup.string().required("Pertanyaan keturunan wajib diisi!"),
        diseaseHistory: Yup.string(),
        selectPatient: Yup.boolean(),
        selectDiabetesType: Yup.number(),
    });

    const [gender, setGender] = useState("");
    const [descendant, setDescendant] = useState("");
    const [isDiabetes, setIsDiabetes] = useState("");
    const [diabetesType, setDiabetesType] = useState("");
    
    const [openDatePicker, setOpenDatePicker] = useState(false);
    const [date, setDate] = useState(new Date());

    const handleOnPressDatePicker = () => {
        setOpenDatePicker(!openDatePicker)
    }

    const [disabledButton, setDisabledButton] = useState(false);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView>
                <View
                    style={{ 
                        paddingTop: 25,
                        paddingHorizontal: 16,
                        backgroundColor: '#DA6E35',
                    }}
                >
                    <TouchableOpacity
                        style={{ width: 50 }}
                        onPress={() => router.back()}
                    >
                        <Image
                            source={require('../../assets/images/arrow-back.png')}
                            style={{
                                marginBottom: 8,
                                marginLeft: 8,
                                width: 40,
                                height: 40,
                                objectFit: 'cover',
                                tintColor: 'white'
                            }}
                        />
                    </TouchableOpacity>
                    <Text style={styles.title}>Edit Profil</Text>
                    <Text style={styles.subTitle}>Perubahan data diri terkait akunmu</Text>
                </View>
                <Formik
                    enableReinitialize={true}
                    initialValues={initialFormValues}
                    validationSchema={validationSchema}
                    onSubmit={async (values) => {
                        const birthDate = dayjs(values.birthDate);
                        const currentDate = dayjs();
                        const calculatedAge = currentDate.diff(birthDate, "year");
                        const mappedValues = {
                            firstname: values.firstname,
                            lastname: values.lastname,
                            weight: Number(values.weight),
                            height: Number(values.height),
                            age: Number(calculatedAge),
                            DOB: new Date(values.birthDate),
                            gender: values.gender,
                            is_descendant_diabetes: values.descendant,
                            medical_history: values.diseaseHistory,
                            is_diabetes: values.isDiabetes? values.isDiabetes : isDiabetes,
                            diabetes_type: values.diabetesType? values.diabetesType : diabetesType,
                        };

                        console.log("updated data: ", mappedValues)

                        await handleUpdateUserProfile(mappedValues);

                        router.back();
                    }}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, setFieldValue, setFieldTouched, touched }) => (
                        <View
                            style={{ 
                                paddingHorizontal: 16,
                                paddingVertical: 16,
                            }}
                        >
                            <View style={{ paddingBottom: 40 }}>
                                <View
                                    className="mb-3"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <StyledCustomTextInput
                                        classStyle="flex-1"
                                        label="Nama depan"
                                        placeholder="Type something here"
                                        value={values.firstname}
                                        onChangeText={(data) => {
                                            handleChange("firstname")(data);
                                            values.firstname && setFieldTouched("firstname", true);
                                        }}
                                        onBlur={() => setFieldTouched("firstname", true)}
                                        error={touched.firstname && errors.firstname}
                                    />
                                </View>
                                <View
                                    className="mb-3 gap-[10px]"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <StyledCustomTextInput
                                        classStyle="flex-1"
                                        label="Berat Badan"
                                        placeholder="Dalam Kg"
                                        keyboardType={'numeric'}
                                        value={values.weight}
                                        onChangeText={(data) => {
                                            handleChange("weight")(data);
                                            values.weight && setFieldTouched("weight", true);
                                        }}
                                        onBlur={() => setFieldTouched("weight", true)}
                                        error={touched.weight && errors.weight}
                                    />
                                    <StyledCustomTextInput
                                        classStyle="flex-1"
                                        label="Tinggi Badan"
                                        placeholder="Dalam Cm"
                                        keyboardType={'numeric'}
                                        value={values.height}
                                        onChangeText={(data) => {
                                            handleChange("height")(data);
                                            values.height && setFieldTouched("height", true);
                                        }}
                                        onBlur={() => setFieldTouched("height", true)}
                                        error={touched.height && errors.height}
                                    />
                                </View>
                                <View
                                    className="mb-3"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <View
                                        style={{
                                            flexGrow: 1
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                fontFamily: "Helvetica-Bold",
                                            }}
                                        >
                                            Tanggal Lahir
                                        </Text>
                                        <Pressable
                                            style={{
                                                width: "100%",
                                                paddingHorizontal: 14,
                                                paddingVertical: 10,
                                                borderWidth: 1,
                                                borderRadius: 8,
                                                borderColor: touched.birthDate && errors.birthDate
                                                    ? "red"
                                                    : "#969696",
                                            }}
                                            onPress={() => {
                                                handleOnPressDatePicker();
                                                setFieldTouched("birthDate", true);
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: "Helvetica",
                                                    fontSize: 16,
                                                }}
                                            >
                                                {dayjs(values.birthDate).format("DD/MM/YYYY")}
                                            </Text>
                                        </Pressable>
                                        {touched.birthDate && errors.birthDate && (
                                            <View
                                                className="gap-1"
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Ionicons
                                                    name="warning"
                                                    size={16}
                                                    color="red"
                                                />
                                                <Text
                                                    style={{
                                                        color: '#EF4444',
                                                        fontFamily: 'Helvetica',
                                                    }}
                                                >
                                                    {errors.birthDate}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                                <View className="mb-3">
                                    <Text style={styles.headerTextInput}>Jenis Kelamin</Text>
                                    <View
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        {isGender.map((item, index) => (
                                            <TouchableOpacity
                                                key={item.value}
                                                style={[
                                                    styles.selectionButton,
                                                    { marginRight: index === 0 ? 5 : "" },
                                                    { marginLeft: index === 1 ? 5 : "" },
                                                    {
                                                        backgroundColor:
                                                            gender === item.value
                                                                ? "#EC8F5E"
                                                                : "transparent",
                                                    },
                                                ]}
                                                onPress={() => {
                                                    setFieldTouched("gender", true);
                                                    setGender(item.value);
                                                    setFieldValue("gender", item.value);
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        color:
                                                            gender === item.value
                                                                ? "#ffffff"
                                                                : "#EC8F5E",
                                                        fontSize: 12,
                                                        fontFamily: 'Helvetica-Bold',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    {item.label}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                    {touched.gender && errors.gender && (
                                        <View
                                            className="gap-1"
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Ionicons name="warning" size={16} color="red" />
                                            <Text
                                                style={{
                                                    color: '#EF4444',
                                                    fontFamily: 'Helvetica',
                                                }}
                                            >
                                                {errors.gender}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                                <View className="mb-3">
                                    <Text style={styles.headerTextInput}>
                                        Apakah Anda memiliki keturunan dengan riwayat penyakit
                                        diabetes?
                                    </Text>
                                    <View
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        {isDescendant.map((item, index) => (
                                            <TouchableOpacity
                                                key={item.value}
                                                style={[
                                                    styles.selectionButton,
                                                    {
                                                        marginRight: index === 0 ? 5 : "",
                                                        marginLeft: index === 1 ? 5 : "" ,
                                                        backgroundColor: descendant == item.value? "#EC8F5E" : "transparent",
                                                    },
                                                ]}
                                                onPress={() => {
                                                    setFieldTouched("descendant", true);
                                                    setDescendant(item.value);
                                                    setFieldValue("descendant", item.value);
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        color:
                                                            descendant == item.value
                                                                ? "#ffffff"
                                                                : "#EC8F5E",
                                                        fontSize: 12,
                                                        fontFamily: 'Helvetica-Bold',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    {item.label}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                    {touched.descendant && errors.descendant && (
                                        <View
                                            className="gap-1"
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Ionicons name="warning" size={16} color="red" />
                                            <Text
                                                style={{
                                                    color: '#EF4444',
                                                    fontFamily: 'Helvetica',
                                                }}
                                            >
                                                {errors.descendant}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                                <View>
                                    <Text style={styles.headerTextInput}>Apakah Anda tergolong pasien diabetes?</Text>
                                    <View
                                        className="mb-3"
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <TouchableOpacity
                                            style={[
                                                styles.selectionButtonTriplet,
                                                {
                                                    backgroundColor: !isDiabetes? "#EC8F5E" : "transparent",
                                                },
                                            ]}
                                            onPress={() => {
                                                setFieldTouched("isDiabetes", true);
                                                setIsDiabetes(false);
                                                setFieldValue("isDiabetes", false);
                                                setDiabetesType(0);
                                                setFieldValue("diabetesType", 0);
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color:
                                                        !isDiabetes
                                                            ? "#ffffff"
                                                            : "#EC8F5E",
                                                    fontSize: 12,
                                                    fontFamily: 'Helvetica-Bold',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                Non-Diabetes
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[
                                                styles.selectionButtonTriplet,
                                                {
                                                    backgroundColor: diabetesType==1? "#EC8F5E" : "transparent",
                                                },
                                            ]}
                                            onPress={() => {
                                                setFieldTouched("diabetesType", true);
                                                setDiabetesType(1);
                                                setFieldValue("diabetesType", 1);
                                                setIsDiabetes(true);
                                                setFieldValue("isDiabetes", true);
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color:
                                                        diabetesType==1
                                                            ? "#ffffff"
                                                            : "#EC8F5E",
                                                    fontSize: 12,
                                                    fontFamily: 'Helvetica-Bold',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                Diabetes Tipe 1
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[
                                                styles.selectionButtonTriplet,
                                                {
                                                    backgroundColor: diabetesType==2? "#EC8F5E" : "transparent",
                                                },
                                            ]}
                                            onPress={() => {
                                                setFieldTouched("diabetesType", true);
                                                setDiabetesType(2);
                                                setFieldValue("diabetesType", 2);
                                                setIsDiabetes(true);
                                                setFieldValue("isDiabetes", true);
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color:
                                                        diabetesType==2
                                                            ? "#ffffff"
                                                            : "#EC8F5E",
                                                    fontSize: 12,
                                                    fontFamily: 'Helvetica-Bold',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                Diabetes Tipe 2
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <StyledCustomTextInput
                                    label="Riwayat Penyakit"
                                    placeholder="Cth: Kolesterol"
                                    value={values.diseaseHistory}
                                    onBlur={() => setFieldTouched("diseaseHistory", true)}
                                    onChangeText={handleChange("diseaseHistory")}
                                    error={errors.diseaseHistory}
                                />
                            </View>

                            {setDisabledButton((Object.keys(errors).length > 0 || Object.keys(touched).length == 0) ? true : false)}
                            
                            <View style={{ marginTop: 'auto' }}>
                                <TouchableOpacity
                                    style={{
                                        marginTop: 20,
                                        paddingVertical: 12,
                                        backgroundColor: disabledButton? '#D8D8D8' : '#DA6E35',
                                        borderRadius: 8,
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                    onPress={() => handleSubmit()}
                                    disabled={disabledButton}
                                >
                                    <Text
                                        style={{ 
                                            color: disabledButton? '#969696' : 'white',
                                            fontSize: 18,
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
                                            color: '#FE3F11',
                                            fontSize: 18,
                                            fontFamily: 'Helvetica-Bold',
                                        }}
                                        onPress={() => router.back()}
                                    >
                                        Batalkan
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {openDatePicker ? (
                                <DateTimePicker
                                    value={values.birthDate ? values.birthDate : date}
                                    mode="date"
                                    display="spinner"
                                    minimumDate={new Date(1900, 1, 1)}
                                    maximumDate={new Date()}
                                    onChange={(event, selectedDate) => {
                                        handleOnPressDatePicker();
                                        if (selectedDate) {
                                            dateFormat = dayjs(selectedDate).format("DD/MM/YYYY");
                                            console.log(selectedDate);
                                            setFieldValue("birthDate", selectedDate);
                                            setFieldTouched("birthDate", true);
                                        }
                                    }}
                                />
                            ) : null}
                        </View>
                    )}
                </Formik>
            </ScrollView>
        </TouchableWithoutFeedback>
    )
}
 
const styles = StyleSheet.create({
    title: {
        marginBottom: -6,
        color: 'white',
        fontSize: 32,
        fontFamily: 'Helvetica-Bold',
    },
    subTitle: {
        marginBottom: 5,
        color: 'white',
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
    selectionButtonTriplet: {
        width: '31%',
        height: 30,
        borderWidth: 1,
        borderColor: '#EC8F5E',
        borderRadius: 5,
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