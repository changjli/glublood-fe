import * as Notifications from 'expo-notifications';

// First, set the handler that will cause the notification
// to show the alert
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Second, call scheduleNotificationAsync()
Notifications.scheduleNotificationAsync({
  content: {
    title: 'Halo! Sobat Glublood 😁',
  },
  trigger: null,
});