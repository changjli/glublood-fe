import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Modal,
    Button,
    Pressable,
    Image,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyledCustomTextInput } from "@/components/CustomInput/CustomTextInput/userProfile";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import { TextInput } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";

// Selection button state (gender)
const isGender = [
    { label: "Pria", value: "male" },
    { label: "Wanita", value: "female" },
];

// Selection button state (descendant)
const isDescendant = [
    { label: "Iya", value: 1 },
    { label: "Tidak", value: 0 },
];

const Personalization1 = ({ handleChange, setFieldValue, setFieldTouched, values, touched, errors }) => {
    const [gender, setGender] = useState(values.gender || "");
    const [descendant, setDescendant] = useState(values.descendant || "");

    const [openDatePicker, setOpenDatePicker] = useState(false);
    const [date, setDate] = useState(new Date());

    const [focus, setFocus] = useState(false);
    const [image, setImage] = useState();

    const handleOnPressDatePicker = () => {
        setOpenDatePicker(!openDatePicker);
    };

    const handleOnChangeDatePicker = (event, selectedDate) => {
        handleOnPressDatePicker();
        if (selectedDate) {
            dateFormat = dayjs(selectedDate).format("DD/MM/YYYY");
            console.log(dateFormat);
            setFieldValue("birthDate", selectedDate);
            setFieldTouched("birthDate", true);
        }
    };

    useEffect(() => {
        if (values.birthDate) {
            const birthDate = dayjs(values.birthDate);
            const currentDate = dayjs();
            const calculatedAge = currentDate.diff(birthDate, "year");

            // Set the age in the form values
            setFieldValue("age", calculatedAge);
        }
    }, [values.birthDate, setFieldValue]);

    return (
        <View className="mt-4">
            <Text style={styles.title}>Kelengkapan{"\n"}Data Diri</Text>
            <Text style={styles.subTitle}>
                Berkaitan dengan informasi pribadi Anda
            </Text>
            <View>
                <View
                    className="mb-2"
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <StyledCustomTextInput
                        classStyle="mr-2 flex-1"
                        label="Nama depan"
                        placeholder="Type something here"
                        value={values.firstname}
                        onChangeText={handleChange("firstname")}
                        onBlur={() => setFieldTouched("firstname", true)}
                        error={touched.firstname && errors.firstname}
                    />
                </View>
                <View
                    className="mb-2"
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <StyledCustomTextInput
                        classStyle="mr-2 flex-1"
                        label="Berat Badan"
                        placeholder="Dalam Kg"
                        value={values.weight}
                        onChangeText={handleChange("weight")}
                        onBlur={() => setFieldTouched("weight", true)}
                        error={touched.weight && errors.weight}
                    />
                    <StyledCustomTextInput
                        classStyle="ml-2 flex-1"
                        label="Tinggi Badan"
                        placeholder="Dalam Cm"
                        value={values.height}
                        onChangeText={handleChange("height")}
                        onBlur={() => setFieldTouched("height", true)}
                        error={touched.height && errors.height}
                    />
                </View>
                <View
                    className="mb-2"
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    {/* <StyledCustomTextInput
                        classStyle='mr-2 flex-1'
                        label='Usia'
                        placeholder='Tahun'
                        value={values.age}
                        onChangeText={handleChange('age')}
                        error={errors.age}
                    /> */}
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
                <View className="mb-4">
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
                                    { marginRight: index === 0 ? 8 : "" },
                                    { marginLeft: index === 1 ? 8 : "" },
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
                                        fontSize: 14,
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
                <View className="mb-4">
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
                                        marginRight: index === 0 ? 8 : "",
                                        marginLeft: index === 1 ? 8 : "" ,
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
                                        fontSize: 14,
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
                <StyledCustomTextInput
                    label="Riwayat Penyakit"
                    placeholder="Cth: Kolesterol"
                    value={values.diseaseHistory}
                    onChangeText={handleChange("diseaseHistory")}
                    error={errors.diseaseHistory}
                />
            </View>

            {openDatePicker ? (
                <DateTimePicker
                    value={values.birthDate ? values.birthDate : date}
                    mode="date"
                    display="spinner"
                    minimumDate={new Date(1900, 1, 1)}
                    maximumDate={new Date()}
                    onChange={handleOnChangeDatePicker}
                />
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        marginBottom: -5,
        fontSize: 32,
        fontFamily: ["Helvetica-Bold"],
    },
    subTitle: {
        marginBottom: 14,
        color: "#969696",
        fontSize: 14,
        fontFamily: ["Helvetica"],
    },
    headerTextInput: {
        marginVertical: 0,
        paddingVertical: 0,
        fontFamily: ["Helvetica-Bold"],
        fontSize: 12,
    },
    selectionButton: {
        height: 30,
        borderWidth: 1,
        borderColor: "#EC8F5E",
        borderRadius: 5,
        flex: 1,
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    selectionButtonText: {
        color: "#EC8F5E",
        fontSize: 18,
        fontFamily: ["Helvetica-Bold"],
        textAlign: "center",
    },
    centeredView: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    modal: {
        margin: 20,
        padding: 25,
        width: "90%",
        backgroundColor: "#F5FCFF",
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        elevation: 3,
    },
});

export default Personalization1;
