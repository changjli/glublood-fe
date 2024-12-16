import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

Notifications.addNotificationReceivedListener(notification => {
  Notifications.presentNotificationAsync({
    title: notification.request.content.title,
    body: notification.request.content.body,
  });
});
