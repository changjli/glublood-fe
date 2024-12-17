import { addNotificationReceivedListener, addNotificationResponseReceivedListener, cancelAllScheduledNotificationsAsync, cancelScheduledNotificationAsync, dismissAllNotificationsAsync, NotificationTriggerInput, requestPermissionsAsync, scheduleNotificationAsync, setNotificationHandler } from "expo-notifications"
import useAsyncStorage from "./useAsyncStorage"
import { useCustomAlert } from "@/app/context/CustomAlertProvider"
import useNotification from "./useNotification"

export type Reminder = {
    reminderTypes: number[]
    time: string
    repeatDays: number[]
    notes: string
    isEnabled: boolean
}

export type ReminderStorage = {
    id: string
    reminderTypes: number[]
    time: string
    repeatDays: number[]
    notes: string
    isEnabled: boolean
    notifications: string[]
}

const TITLE = "Ding! Dong! Waktunya tiba ⏰"

export default function useReminder() {
    const { showAlert } = useCustomAlert()
    const { getObjectData, storeObjectData, deleteDataByKey } = useAsyncStorage()
    const { clearNotificaionById } = useNotification()

    const getAllReminder = async (setLoading: (loading: boolean) => void) => {
        return await getObjectData('reminders')
            .then(reminders => {
                console.log('[useNotification][getAllReminder]', reminders)
                setLoading(false)
                return reminders
            }).catch(err => {
                console.log('[useNotification][getAllReminder]', err)
                setLoading(false)
                return Promise.reject(err)
            })
    }

    const getReminderById = async (setLoading: (loading: boolean) => void, id: string) => {
        return await getObjectData('reminders')
            .then(reminders => {
                console.log('[useNotification][getAllReminder]', reminders)
                setLoading(false)
                return reminders.find((reminder: ReminderStorage) => reminder.id == id)
            }).catch(err => {
                console.log('[useNotification][getAllReminder]', err)
                setLoading(false)
                return Promise.reject(err)
            })
    }

    const clearReminderById = async (id: string) => {
        try {
            const reminder = await getReminderById(() => { }, id) as ReminderStorage
            if (reminder) {
                const deleteNotificationPromises = reminder.notifications.map(async notification => await clearNotificaionById(notification))
                await Promise.all(deleteNotificationPromises)

                const currentReminders = await getObjectData('reminders') as ReminderStorage[]

                let filteredReminders: ReminderStorage[] = []
                if (currentReminders && currentReminders.length > 0) {
                    filteredReminders = currentReminders.filter(currentReminder => (currentReminder.id != reminder.id))

                    clearReminderById(reminder.id)
                }

                const newReminders = filteredReminders.sort((a, b) => {
                    const timeToMinutes = (time: string) => {
                        const [hours, minutes] = time.split(":").map(Number);
                        return hours * 60 + minutes;
                    };
                    return timeToMinutes(a.time) - timeToMinutes(b.time);
                })

                await storeObjectData('reminders', newReminders)
            }
        } catch (e) {
            console.log(e)
            showAlert('Error clear reminder by id!', 'error')
        }
    }

    const clearAllReminder = async () => {
        try {
            const reminders = await getAllReminder(() => { }) as ReminderStorage[] ?? []
            const deleteReminderPromises = reminders.map(async reminder => {
                const deleteNotificationPromises = reminder.notifications.map(async notification => await clearNotificaionById(notification))
                await Promise.all(deleteNotificationPromises)
            })
            await Promise.all(deleteReminderPromises)
            await deleteDataByKey('reminders')
        } catch (e) {
            console.log(e)
            showAlert('Error clear all reminder!', 'error')
        }
    }

    const scheduleReminder = async (reminder: Reminder) => {
        const [hour, minute] = reminder.time.split(":")

        const notifications: string[] = []

        if (reminder.repeatDays.length > 0) {
            const dayPromises = reminder.repeatDays.map(async day => {
                const typePromises = reminder.reminderTypes.map(async type => {
                    const notificationId = await scheduleNotificationAsync({
                        content: {
                            title: TITLE,
                            body: resolveNotificationType(type),
                        },
                        trigger: {
                            hour: Number(hour),
                            minute: Number(minute),
                            weekday: day,
                            repeats: true,
                        },
                    });
                    notifications.push(notificationId);
                });
                await Promise.all(typePromises);
            });
            await Promise.all(dayPromises);
        } else {
            const now = new Date();

            const notificationTime = new Date();
            notificationTime.setHours(Number(hour), Number(minute), 0, 0);
            if (notificationTime <= now) {
                notificationTime.setDate(notificationTime.getDate() + 1);
            }

            const typePromises = reminder.reminderTypes.map(async type => {
                const notificationId = await scheduleNotificationAsync({
                    content: {
                        title: TITLE,
                        body: resolveNotificationType(type),
                    },
                    trigger: {
                        date: notificationTime,
                    },
                });
                notifications.push(notificationId);
            });
            await Promise.all(typePromises);
        }

        return notifications
    }

    const validateReminder = async (newReminder: Reminder) => {
        const currentReminders = await getObjectData('reminders') as ReminderStorage[] ?? []

        for (const reminder of currentReminders) {
            if (reminder.id == generateUniqueKey(newReminder)) {
                return false
            }

            if (newReminder.time !== reminder.time) continue;

            // e.g. [1,3,4] == [3,4]
            const daysMatch = isSubset(newReminder.repeatDays, reminder.repeatDays);
            const typesMatch = isSubset(newReminder.reminderTypes, reminder.reminderTypes);

            if (daysMatch && typesMatch) {
                return false
            }
        }
        return true;
    }

    const createReminder = async (reminder: Reminder) => {
        try {
            const validate = await validateReminder(reminder)
            if (!validate) {
                console.log('Reminder already exists')
                return
            }

            const notifications = await scheduleReminder(reminder)

            const newReminder: ReminderStorage = {
                ...reminder,
                id: generateUniqueKey(reminder),
                notifications: notifications,
            }

            const currentReminders = await getObjectData('reminders') as ReminderStorage[] ?? []

            const newReminders = [...currentReminders, newReminder].sort((a, b) => {
                const timeToMinutes = (time: string) => {
                    const [hours, minutes] = time.split(":").map(Number);
                    return hours * 60 + minutes;
                };
                return timeToMinutes(a.time) - timeToMinutes(b.time);
            })

            console.log(newReminders)

            await storeObjectData('reminders', newReminders)

        } catch (e) {
            console.log(e)
            showAlert('Error scheduling notification(s)!', 'error')
        }
    }

    const updateReminder = async (reminder: ReminderStorage) => {
        try {
            // delete old reminder
            const currentReminders = await getObjectData('reminders') as ReminderStorage[]

            let filteredReminders: ReminderStorage[] = []
            if (currentReminders && currentReminders.length > 0) {
                filteredReminders = currentReminders.filter(currentReminder => (currentReminder.id != reminder.id))

                clearReminderById(reminder.id)
            }

            const newReminders = filteredReminders.sort((a, b) => {
                const timeToMinutes = (time: string) => {
                    const [hours, minutes] = time.split(":").map(Number);
                    return hours * 60 + minutes;
                };
                return timeToMinutes(a.time) - timeToMinutes(b.time);
            })

            await storeObjectData('reminders', newReminders)

            await createReminder(reminder)
        } catch (e) {
            console.log(e)
            showAlert('Error scheduling notification(s)!', 'error')
        }
    }

    const toggleReminder = async (reminder: ReminderStorage) => {
        if (reminder.isEnabled) {
            const currentReminders = await getObjectData('reminders') as ReminderStorage[] ?? []

            let filteredReminders: ReminderStorage[] = []
            if (currentReminders && currentReminders.length > 0) {
                filteredReminders = currentReminders.filter(currentReminder => (currentReminder.id != reminder.id))

                clearReminderById(reminder.id)
            }

            const newReminders = [...filteredReminders, { ...reminder, isEnabled: false }].sort((a, b) => {
                const timeToMinutes = (time: string) => {
                    const [hours, minutes] = time.split(":").map(Number);
                    return hours * 60 + minutes;
                };
                return timeToMinutes(a.time) - timeToMinutes(b.time);
            })

            await storeObjectData('reminders', newReminders)
        } else {
            updateReminder({ ...reminder, isEnabled: true })
        }
    }

    const resolveNotificationType = (type: number) => {
        if (type == 1) {
            return 'Yuk udah saatnya untuk pengecekan gula darah nih! 🤗'
        } else if (type == 2) {
            return 'Jangan lupa untuk minum obat ya! 🤗'
        } else if (type == 3) {
            return 'Yuk udah saatnya untuk olahraga biar kesehatan tubuhmu terjaga!🤗'
        }
    }

    const generateUniqueKey = (reminder: Reminder): string => {
        const formattedTime = reminder.time.replace(':', '');
        const formattedRepeatDays = reminder.repeatDays.sort((a, b) => a - b).join('');
        const formattedReminderTypes = reminder.reminderTypes.sort((a, b) => a - b).join('');

        return `${formattedTime}-${formattedRepeatDays}-${formattedReminderTypes}`;
    };

    const isSubset = (subset: number[], superset: number[]): boolean => {
        return subset.every(value => superset.includes(value));
    };

    return {
        getAllReminder,
        createReminder,
        updateReminder,
        clearAllReminder,
        getReminderById,
        clearReminderById,
        toggleReminder,
    }

}