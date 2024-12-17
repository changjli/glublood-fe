import { addNotificationReceivedListener, addNotificationResponseReceivedListener, cancelAllScheduledNotificationsAsync, cancelScheduledNotificationAsync, dismissAllNotificationsAsync, NotificationTriggerInput, requestPermissionsAsync, scheduleNotificationAsync, setNotificationHandler } from "expo-notifications"
import { useCustomAlert } from "@/app/context/CustomAlertProvider"

export default function useNotification() {
    const { showAlert } = useCustomAlert()

    const requestNotificationPermission = async () => {
        const { status } = await requestPermissionsAsync();
        if (status !== 'granted') {
            showAlert('Permission for notifications is required.', 'warning');
            return
        }
    }

    const setUpNotification = () => {
        setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: true,
            }),
        });

        // Add listener for foreground notifications
        const subscriptionReceived = addNotificationReceivedListener((notification) => {
            console.log("Notification received in foreground:", notification);
        });

        // Add listener for user interaction with notifications
        const subscriptionResponse = addNotificationResponseReceivedListener((response) => {
            console.log("User interacted with notification:", response);
        });

        return () => {
            subscriptionReceived.remove();
            subscriptionResponse.remove();
        };
    }

    const clearNotificaionById = async (id: string) => {
        try {
            await cancelScheduledNotificationAsync(id);
        } catch (error) {
            showAlert('Error clearing notification by id!', 'error')
        }
    }

    const clearAllNotifications = async () => {
        try {
            await cancelAllScheduledNotificationsAsync();
        } catch (error) {
            showAlert('Error clearing all notifications!', 'error')
        }
    }

    return {
        requestNotificationPermission,
        setUpNotification,
        clearAllNotifications,
        clearNotificaionById,
    }
}