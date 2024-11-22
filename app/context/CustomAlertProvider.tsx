import CustomText from '@/components/CustomText';
import { Colors } from '@/constants/Colors';
import { FlexStyles } from '@/constants/Flex';
import { FontAwesome } from '@expo/vector-icons';
import React, { createContext, useState, ReactNode, useContext } from 'react';
import { View, Text, Button, StyleSheet, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import Modal, { ModalProps } from "react-native-modal";

type AlertType = 'success' | 'warning' | 'error'

interface CustomAlertContextType {
    showAlert: (message: string, type: AlertType, onClose?: () => void) => void;
}

const CustomAlertContext = createContext<CustomAlertContextType>({
    showAlert: () => { },
});

interface AlertState {
    visible: boolean;
    message: string;
    type: AlertType,
    onClose?: () => void;
}

interface CustomAlertProviderProps {
    children: ReactNode;
}

export const CustomAlertProvider = ({ children }: CustomAlertProviderProps) => {
    const [alertState, setAlertState] = useState<AlertState>({
        visible: false,
        message: '',
        type: 'success',
        onClose: undefined,
    });

    const showAlert = (message: string, type: AlertType, onClose?: () => void) => {
        setAlertState({ visible: true, type, message, onClose });
    };

    const closeAlert = () => {
        setAlertState((prevState) => ({ ...prevState, visible: false }));
        if (alertState.onClose) {
            alertState.onClose();
        }
    };

    const resolveTypeText = (type: string) => {
        if (type == 'success') {
            return 'Success'
        } else if (type == 'warning') {
            return 'Warning'
        } else if (type == 'error') {
            return 'Error'
        }
    }

    const resolveTypeIcon = (type: string) => {
        if (type == 'success') {
            return (
                <View style={[styles.icon, { backgroundColor: Colors.light.success }]}>
                    <FontAwesome name={'check'} size={14} color={'white'} />
                </View>
            )
        } else if (type == 'warning') {
            return (
                <View style={[styles.icon, { backgroundColor: Colors.light.warning }]}>
                    <FontAwesome name={'exclamation'} size={14} color={'white'} />
                </View>
            )
        } else if (type == 'error') {
            return (
                <View style={[styles.icon, { backgroundColor: Colors.light.danger }]}>
                    <FontAwesome name={'close'} size={14} color={'white'} />
                </View>
            )
        }
    }

    return (
        <CustomAlertContext.Provider value={{ showAlert }}>
            {children}
            <Modal
                isVisible={alertState.visible}
                customBackdrop={(
                    <TouchableWithoutFeedback onPress={closeAlert}>
                        <View style={styles.modalBackdrop} />
                    </TouchableWithoutFeedback>
                )}
            >
                <View style={styles.overlay}>
                    <View style={styles.alertContainer}>
                        <View style={[FlexStyles.flexRow, { gap: 4 }]}>
                            <View style={styles.icon}>
                                {resolveTypeIcon(alertState.type)}
                            </View>
                            <CustomText weight='heavy'>{resolveTypeText(alertState.type)}!</CustomText>
                        </View>
                        <CustomText size='sm'>{alertState.message}</CustomText>
                        <View style={[FlexStyles.flexRow, { justifyContent: 'flex-end' }]}>
                            <TouchableOpacity onPress={closeAlert}>
                                <CustomText size='sm' weight='heavy' style={{ color: Colors.light.primary }}>OK</CustomText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </CustomAlertContext.Provider>
    );
};

const styles = StyleSheet.create({
    modalBackdrop: {
        flex: 1,
        backgroundColor: Colors.light.backdrop,
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertContainer: {
        width: 300,
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 5,
    },
    message: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    icon: {
        ...FlexStyles.flexRow,
        justifyContent: 'center',
        width: 16,
        height: 16,
        borderRadius: 8,
    }
});

export const useCustomAlert = (): CustomAlertContextType => {
    return useContext(CustomAlertContext);
};
