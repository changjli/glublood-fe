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
        lastname: Yup.string(),
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
        selectPatient: Yup.number().required("Wajib diisi!"),
        selectDiabetesType: Yup.number().required("Wajib diisi!"),
    });

    // Validation Personalization
    const validatePersonalization = async (formikProps, personalization) => {
        const personalization1 = [
            "firstname",
            "lastname",
            "weight",
            "height",
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
    const [currentPosition, setCurrentPosition] = useState(1);

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
            console.log(newPosition);
            return newPosition < 1 ? 1 : newPosition > 4 ? 4 : newPosition;
        });
    };

    // User Profile Handler
    const userProfileHandler = (formikValues) => {
        return {
            firstname: formikValues.firstname,
            lastname: formikValues.lastname,
            weight: formikValues.weight,
            height: formikValues.height,
            age: formikValues.age,
            DOB: formikValues.birthDate,
            gender: formikValues.gender,
            is_descendant_diabetes:
                formikValues.descendant === 1 ? true : false,
            is_diabetes: formikValues.selectPatient,
            medical_history: formikValues.diseaseHistory,
            diabetes_type: formikValues.selectDiabetesType,
        };
    };

    const pageController = async (step, formikProps) => {
        if (step > 0) {
            let errors;

            switch (currentPosition) {
                case 1:
                    errors = await validatePersonalization(formikProps, 1);
                    break;
                case 2:
                    errors = await validatePersonalization(formikProps, 2);
                    break;
                case 3:
                    errors = await validatePersonalization(formikProps, 3);
                    break;
            }

            // Check if there are any errors
            if (Object.keys(errors).length === 0) {
                console.log(formikProps.values);

                if (
                    currentPosition === 2 &&
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

                if (
                    currentPosition === 3 &&
                    formikProps.values.selectDiabetesType !== -1
                ) {
                    formikProps.handleSubmit(
                        handleStoreUserProfile(
                            userProfileHandler(formikProps.values)
                        )
                    );

                    router.push("/(tabs)/");
                    return;
                }

                pageMover(step);
            } else {
                console.log(errors);
                // Prevent moving to next page if there are errors
                return;
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
                        descendant: "-",
                        diseaseHistory: "",
                        selectPatient: "-",
                        selectDiabetesType: -1,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values) =>
                        console.log("Values onSubmit Formik: ", values)
                    }
                >
                    {(formikProps) => {
                        // Determine if next button should be disabled based on current step and validation
                        const isNextButtonDisabled = () => {
                            switch (currentPosition) {
                                case 1:
                                    return (
                                        formikProps.errors.firstname ||
                                        formikProps.errors.lastname ||
                                        formikProps.errors.weight ||
                                        formikProps.errors.height ||
                                        formikProps.errors.birthDate ||
                                        formikProps.errors.gender ||
                                        formikProps.errors.descendant
                                    );
                                case 2:
                                    return formikProps.errors.selectPatient;
                                case 3:
                                    return formikProps.errors
                                        .selectDiabetesType;
                                default:
                                    return false;
                            }
                        };

                        return (
                            <View
                                style={{
                                    height: "100%",
                                    display: "flex",
                                    flex: 1,
                                }}
                            >
                                <View
                                    style={{
                                        position: "relative",
                                        zIndex: 1,
                                        paddingBottom: 15,
                                        height: 85,
                                        backgroundColor: "#DA6E35",
                                        justifyContent: "flex-end",
                                    }}
                                >
                                    <TouchableOpacity
                                        style={{
                                            position: "absolute",
                                            zIndex: 1,
                                            top: 38,
                                            left: 57,
                                        }}
                                        disabled={true}
                                    >
                                        {currentPosition > 1 && (
                                            <Ionicons
                                                name="checkmark"
                                                color="#197340"
                                                size={24}
                                            />
                                        )}
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{
                                            position: "absolute",
                                            zIndex: 1,
                                            top: 38,
                                            left: 194,
                                        }}
                                        disabled={true}
                                    >
                                        {currentPosition > 2 && (
                                            <Ionicons
                                                name="checkmark"
                                                color="#197340"
                                                size={24}
                                            />
                                        )}
                                    </TouchableOpacity>
                                    <StepIndicator
                                        currentPosition={currentPosition - 1}
                                        customStyles={customStyles}
                                        stepCount="3"
                                    />
                                </View>
                                <View
                                    style={{
                                        paddingHorizontal: 15,
                                        height: 680,
                                    }}
                                >
                                    {React.createElement(
                                        formikSteps[currentPosition - 1]
                                            .component,
                                        formikProps
                                    )}
                                </View>
                                <View
                                    style={{
                                        marginTop: "auto",
                                        paddingHorizontal: 15,
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent:
                                            currentPosition == 4
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
                                                    currentPosition == 1 ||
                                                    currentPosition == 4
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
                                            className="text-center"
                                        />
                                    </TouchableOpacity>

                                    {currentPosition !== 4 ? (
                                        <TouchableOpacity
                                            style={[
                                                styles.nextButton,
                                                {
                                                    marginLeft:
                                                        currentPosition == 1
                                                            ? "auto"
                                                            : 0,
                                                    width:
                                                        currentPosition == 4
                                                            ? 175
                                                            : 55,
                                                    opacity:
                                                        isNextButtonDisabled()
                                                            ? 0.5
                                                            : 1,
                                                },
                                            ]}
                                            onPress={() =>
                                                pageController(1, formikProps)
                                            }
                                            disabled={isNextButtonDisabled()}
                                        >
                                            <Ionicons
                                                name="arrow-forward"
                                                color="#ffffff"
                                                size={24}
                                                className="text-center"
                                            />
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity
                                            style={[
                                                styles.nextButton,
                                                {
                                                    marginLeft:
                                                        currentPosition == 1
                                                            ? "auto"
                                                            : 0,
                                                    width:
                                                        currentPosition == 4
                                                            ? 175
                                                            : 55,
                                                    opacity:
                                                        isNextButtonDisabled()
                                                            ? 0.5
                                                            : 1,
                                                },
                                            ]}
                                            onPress={() =>
                                                router.push("/prediction/")
                                            }
                                            disabled={isNextButtonDisabled()}
                                        >
                                            <Text
                                                style={{
                                                    color: "white",
                                                    fontFamily:
                                                        "Helvetica-Bold",
                                                    textAlign: "center",
                                                }}
                                            >
                                                Mulai Pengecekkan
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        );
                    }}
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
    stepStrokeWidth: 0,
    currentStepStrokeWidth: 0,
    separatorStrokeWidth: 2,
    stepStrokeCurrentColor: "#DA6E35",
    stepStrokeFinishedColor: "#DA6E35",
    stepStrokeUnFinishedColor: "#aaaaaa",
    separatorFinishedColor: "#8E2E1E",
    separatorUnFinishedColor: "#8E2E1E",
    stepIndicatorFinishedColor: "#FBE8D9",
    stepIndicatorUnFinishedColor: "#8E2E1E",
    stepIndicatorCurrentColor: "#F1AE80",
    currentStepLabelColor: "ffffff",
    stepIndicatorLabelCurrentColor: "#DA6E35",
    stepIndicatorLabelFinishedColor: "#FDF0D7",
    stepIndicatorLabelUnFinishedColor: "#7C7C7C",
    labelSize: 14,
    stepIndicatorLabelFontSize: 14,
    currentStepIndicatorLabelFontSize: 14,
};
