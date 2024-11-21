import { StyleSheet } from "react-native";

export const FlexStyles = StyleSheet.create({
    flexRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center', // Optional
        justifyContent: 'flex-start', // Optional
    },
    flexCol: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start', // Optional
        justifyContent: 'center', // Optional
    },
});