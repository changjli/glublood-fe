import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
    ScrollView,
} from "react-native";
import React, { useState } from "react";
import { Formik } from "formik";
import { Ionicons } from "@expo/vector-icons";
import * as Yup from "yup";
import StepIndicator from "react-native-step-indicator";
import useProfile from "../../hooks/api/profile/useProfile";
import Personalization1 from "./personalization_1";
import Personalization2 from "./personalization_2";
import Personalization3_1 from "./personalization_3_1";
import Personalization3_2 from "./personalization_3_2";
import { router } from "expo-router";

export default function FirstTimeSetup() {
    const { storeUserProfile } = useProfile();
    const [storeLoading, setStoreLoading] = useState(false);

    const handleStoreUserProfile = async (data) => {
        console.log("[handleStoreUserProfile]", data);
        try {
            const res = await storeUserProfile(setStoreLoading, data);
            if (res.status == 200) {
                console.log(res.data);
                Alert.alert("success", res.message);
            } else if (res.status == 400) {
                console.log(res.message);
                Alert.alert("error", res.message);
            }
        } catch (err) {
            console.log("Axios Error:", err);
            Alert.alert("error", "Error: Please try again later");
        }
    };

    const validationSchema = Yup.object().shape({
        firstname: Yup.string().required("Nama lengkap wajib diisi!"),
        lastname: Yup.string().required("Nama lengkap wajib diisi!"),
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
        diseaseHistory: Yup.string().required("Riwayat Penyakit wajib diis!"),
        selectPatient: Yup.number().required("Wajib diisi!"),
        selectDiabetesType: Yup.number().when("selectPatient", {
            is: 1,
            then: (schema) => schema.required("Wajib diisi!"),
            otherwise: (schema) => schema,
        }),
    });

    // Validation Personalization
    const validatePersonalization = async (formikProps, personalization) => {
        const personalization1 = [
            "name",
            "weight",
            "height",
            "age",
            "birthDate",
            "gender",
            "descendant",
            "diseaseHistory",
        ];
        const personalization2 = ["selectPatient"];
        const personalization3 = ["selectDiabetesType"];

        let fieldsToValidate;

        switch (personalization) {
            case 1:
                fieldsToValidate = personalization1.slice();
                break;
            case 2:
                fieldsToValidate = personalization2.slice();
                break;
            case 3:
                fieldsToValidate = personalization3.slice();
                break;
        }

        const errors = {};

        for (const field of fieldsToValidate) {
            await formikProps.setFieldTouched(field, true);
            const formErrors = await formikProps.validateForm();
            if (formErrors[field]) {
                errors[field] = formErrors[field];
            }
        }

        return errors;
    };

    // Stepindicator state
    const [currentPosition, setCurrentPosition] = useState(0);

    // Pages
    const formikSteps = [
        { component: Personalization1 },
        { component: Personalization2 },
        { component: Personalization3_1 },
        { component: Personalization3_2 },
    ];

    const pageMover = (step) => {
        setCurrentPosition((prevPosition) => {
            const newPosition = prevPosition + step;
            return newPosition < 0 ? 0 : newPosition > 3 ? 3 : newPosition;
        });
    };

    // User Profile Handler
    const userProfileHandler = (formikValues) => {
        // let descendant;
        // if(formikValues.descendant === 'yes') {
        //     descendant = 1
        // } else {
        //     descendant = 0
        // }
        return {
            firstname: formikValues.firstname,
            lastname: formikValues.lastname,
            weight: formikValues.weight,
            height: formikValues.height,
            age: formikValues.age,
            DOB: formikValues.birthDate,
            gender: formikValues.gender,
            is_descendant_diabetes: formikValues.descendant,
            is_diabetes: formikValues.selectPatient,
            medical_history: formikValues.diseaseHistory,
            diabetes_type: formikValues.selectDiabetesType,
        };
    };

    const pageController = async (step, formikProps) => {
        if (step > 0) {
            let errors;

            switch (currentPosition) {
                case 0:
                    errors = await validatePersonalization(formikProps, 1);
                    break;
                case 1:
                    errors = await validatePersonalization(formikProps, 2);
                    break;
                case 2:
                    errors = await validatePersonalization(formikProps, 3);
                    break;
            }
            if (Object.keys(errors).length === 0) {
                console.log(formikProps.values);

                if (
                    currentPosition === 1 &&
                    formikProps.values.selectPatient === 0
                ) {
                    formikProps.setFieldValue("selectDiabetesType", 0);
                    formikProps.handleSubmit(
                        handleStoreUserProfile(
                            userProfileHandler(formikProps.values)
                        )
                    );
                    step = 2;
                    pageMover(step);
                    return;
                }

                if (currentPosition === 2) {
                    router.navigate("/(tabs)");
                    formikProps.handleSubmit(
                        handleStoreUserProfile(
                            userProfileHandler(formikProps.values)
                        )
                    );
                    return;
                }

                pageMover(step);
            } else {
                console.log(errors);
            }
        } else {
            if (formikProps.values.selectPatient === 0) {
                step = -2;
            }
            pageMover(step);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView>
                <Formik
                    initialValues={{
                        firstname: "",
                        lastname: "",
                        weight: "",
                        height: "",
                        age: "",
                        birthDate: new Date(),
                        gender: "",
                        descendant: "",
                        diseaseHistory: "",
                        selectPatient: "",
                        selectDiabetesType: 0,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values) =>
                        console.log("Values onSubmit Formik: ", values)
                    }
                >
                    {(formikProps) => (
                        <View
                            style={{
                                paddingHorizontal: 20,
                                paddingVertical: 64,
                                height: "100%",
                                display: 'flex',
                                flexGrow: 1,
                            }}
                        >
                            <StepIndicator
                                currentPosition={currentPosition}
                                customStyles={customStyles}
                                stepCount="3"
                            />
                            {React.createElement(
                                formikSteps[currentPosition].component,
                                formikProps
                            )}
                            <View
                                style={{
                                    marginTop: 12,
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent:
                                        currentPosition == 3
                                            ? "flex-end"
                                            : "space-between",
                                    alignItems: "flex-end",
                                }}
                            >
                                <TouchableOpacity
                                    style={[
                                        styles.prevButton,
                                        {
                                            display:
                                                currentPosition == 0 ||
                                                currentPosition == 3
                                                    ? "none"
                                                    : "flex",
                                        },
                                    ]}
                                    onPress={() =>
                                        pageController(-1, formikProps)
                                    }
                                >
                                    <Ionicons
                                        name="arrow-back"
                                        color="#DA6E35"
                                        size={24}
                                        style={{ textAlign: 'center' }}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.nextButton,
                                        {
                                            marginLeft:
                                                currentPosition == 0
                                                    ? "auto"
                                                    : 0,
                                        },
                                        {
                                            width:
                                                currentPosition == 3 ? 175 : 55,
                                        },
                                    ]}
                                    onPress={() =>
                                        pageController(1, formikProps)
                                    }
                                >
                                    {currentPosition === 3 ? (
                                        <Text
                                            style={{ 
                                                color: 'white',
                                                fontFamily: 'Helvetica-Bold',
                                                textAlign: 'center',
                                            }}
                                            onPress={() =>
                                                router.navigate("/prediction")
                                            }
                                        >
                                            Mulai Pengecekkan
                                        </Text>
                                    ) : (
                                        <Ionicons
                                            name="arrow-forward"
                                            color="#ffffff"
                                            size={24}
                                            style={{ textAlign: 'center' }}
                                        />
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </Formik>
            </ScrollView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    nextButton: {
        height: 40,
        backgroundColor: "#DA6E35",
        borderRadius: 8,
        display: "flex",
        justifyContent: "center",
    },
    prevButton: {
        width: 55,
        height: 40,
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: "#DA6E35",
        borderRadius: 8,
        display: "flex",
        justifyContent: "center",
    },
});

const customStyles = {
    stepIndicatorSize: 40,
    currentStepIndicatorSize: 40,
    stepStrokeWidth: 3.5,
    separatorStrokeWidth: 3.5,
    currentStepStrokeWidth: 3.5,
    stepStrokeCurrentColor: "#DA6E35",
    stepStrokeFinishedColor: "#DA6E35",
    stepStrokeUnFinishedColor: "#aaaaaa",
    separatorFinishedColor: "#DA6E35",
    separatorUnFinishedColor: "#aaaaaa",
    stepIndicatorFinishedColor: "#DA6E35",
    stepIndicatorUnFinishedColor: "#ffffff",
    stepIndicatorCurrentColor: "#ffffff",
    labelColor: "#999999",
    currentStepLabelColor: "#DA6E35",
    stepIndicatorLabelCurrentColor: "#DA6E35",
    stepIndicatorLabelFinishedColor: "#ffffff",
    stepIndicatorLabelUnFinishedColor: "#aaaaaa",
    labelSize: 14,
    stepIndicatorLabelFontSize: 14,
    currentStepIndicatorLabelFontSize: 14,
};
