import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router'
import useAsyncStorage from '@/hooks/useAsyncStorage';
import ReminderForm from './ReminderForm';
import CustomButton from '@/components/CustomButton';
import * as Notifications from 'expo-notifications';

export default function ReminderDetail() {
    const { id } = useLocalSearchParams();
    const { getObjectData, getAllKeys, storeObjectData, deleteDataByKey } = useAsyncStorage()

    const [updateLoading, setUpdateLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [reminder, setReminder] = useState<ReminderFormValues>();

    const handleGetReminderDetail = async (id: string) => {
        setUpdateLoading(false);
        try {
            const res = await getObjectData(id)
            setReminder(res)
        } catch (err) {
            console.log('Error get reminder:', err);
        } finally {
            setUpdateLoading(false);
        }
    }

    useEffect(() => {
        if (reminder) {
            console.log("Updated reminder: ", reminder);
        }
    }, [reminder]);

    useEffect(() => {
        handleGetReminderDetail(String(id))
        console.log("id: ", id)
    }, [])

    const generateUniqueKey = (values: ReminderFormValues): string => {
        const formattedTime = values.time.replace(':', '');
        const formattedRepeatDays = values.repeatDays.sort((a, b) => a - b).join('');
        const reminderType = values.reminderType.sort((a, b) => a - b).join('');

        return `reminders${formattedTime}-${formattedRepeatDays}-${reminderType}`;
    };

    const reminderNotificationsRepeat = async (reminder: ReminderFormValues, day: number, type: number) => {
        const [hours, minutes] = reminder.time.split(':').map(Number);
        var body = ''

        switch (type) {
            case 1:
                body = 'Yuk udah saatnya untuk pengecekan gula darah nih! 🤗';
                break;
            case 2:
                body = 'Jangan lupa untuk makan dan minum yaa! 🤗';
                break;
            case 3:
                body = 'Yuk udah saatnya untuk olahraga biar kesehatan tubuhmu terjaga!🤗';
                break;
        }

        const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title: "Ding! Dong! Waktunya tiba ⏰",
                body: body,
                data: { id: reminder.id },
            },
            trigger: {
                weekday: day,
                hour: hours,
                minute: minutes,
                repeats: true,
            },
        });

        return notificationId
    };

    const reminderNotificationsSingle = async (reminder: ReminderFormValues, type: number) => {
        const [hours, minutes] = reminder.time.split(':').map(Number);
        const year = new Date().getFullYear()
        const month = new Date().getMonth()
        const day = new Date().getDate()

        var body = ''

        switch (type) {
            case 1:
                body = 'Yuk udah saatnya untuk pengecekan gula darah nih! 🤗';
                break;
            case 2:
                body = 'Jangan lupa untuk makan dan minum yaa! 🤗';
                break;
            case 3:
                body = 'Yuk udah saatnya untuk olahraga biar kesehatan tubuhmu terjaga!🤗';
                break;
        }

        const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title: "Ding! Dong! Waktunya tiba ⏰",
                body: body,
                data: { id: reminder.id },
            },
            trigger: {
                date: new Date(year, month, day, hours, minutes, 0),
            },
        });

        return notificationId
    };

    const [storeLoading, setStoreLoading] = useState(false)

    const handleSaveReminder = async (values: ReminderFormValues) => {
        values = { ...values, time: '22:27' }
        console.log("hello world", values)
        setStoreLoading(true);
        try {
            await deleteDataByKey(values.id)
            var uniqueKey = generateUniqueKey(values);

            console.log("Unique Key", uniqueKey)
            console.log("Values", values)

            const keys = await getAllKeys();
            const reminderKeys: string[] = []

            keys.forEach((key) => {
                if (key.startsWith('reminder')) {
                    reminderKeys.push(key)
                }
            });

            const storedKeys = uniqueKey.replace('reminders', '');
            const [time, repeatDays, type] = storedKeys.split('-');

            function combineUniqueDigits(str1: string, str2: string) {
                const combinedDigits = new Set();

                for (const digit of str1) {
                    combinedDigits.add(digit);
                }

                for (const digit of str2) {
                    combinedDigits.add(digit);
                }

                return Array.from(combinedDigits).join('');
            }

            var previousKey = ''

            keys.forEach((key) => {
                const tempKey = key.replace('reminders', '')
                if (tempKey.split('-')[0] === time) {
                    if (tempKey.split('-')[1] === repeatDays && tempKey.split('-')[2] !== type) {
                        previousKey = key;

                        const combinedType = combineUniqueDigits(type, tempKey.split('-')[2])
                        values.reminderType = combinedType.split('').map(Number)

                        uniqueKey = generateUniqueKey(values);
                        console.log("uniqueKey: ", uniqueKey);

                    } else if (tempKey.split('-')[2] === type && tempKey.split('-')[1] !== repeatDays) {
                        previousKey = key;

                        const combinedRepeatDays = combineUniqueDigits(repeatDays, tempKey.split('-')[1])
                        values.repeatDays = combinedRepeatDays.split('').map(Number)

                        uniqueKey = generateUniqueKey(values);
                        console.log("uniqueKey: ", uniqueKey);

                    } else {
                        console.log("elseee")
                        return
                    }
                }
            });

            previousKey !== '' ? await deleteDataByKey(previousKey) : '';

            values.id = uniqueKey
            values.reminderType = values.reminderType.sort((a, b) => a - b);
            values.repeatDays = values.repeatDays.sort((a, b) => a - b);

            if (values.repeatDays[0] == 1 && values.repeatDays.length > 1) {
                const rotatedList = values.repeatDays.slice(1).concat(values.repeatDays[0]);
                values.repeatDays = rotatedList
            }

            if (values.repeatDays.length > 0) {
                for (const type of values.reminderType) {
                    for (const day of values.repeatDays) {
                        values.notificationId.push(await reminderNotificationsRepeat(values, day, type))
                    }
                }
            } else {
                for (const type of values.reminderType) {
                    values.notificationId.push(await reminderNotificationsSingle(values, type))
                }
            }

            console.log("[ReminderDetail] Last value: ", values)

            await storeObjectData(uniqueKey, values);
            console.log('Reminder saved successfully!');
            router.navigate('/(notes)/reminder/');
            // console.log(await AsyncStorage.getAllKeys())
            // await AsyncStorage.clear();
        } catch (err) {
            console.log('Error saving reminder:', err);
        } finally {
            setStoreLoading(false);
        }
    };

    const handleDeleteMedicineLog = async (key: string) => {
        try {
            await deleteDataByKey(key)
        } catch (err) {
            console.log('Error saving reminder:', err);
        } finally {
            setStoreLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <ReminderForm
                formValue={{
                    id: reminder ? reminder.id : '',
                    notificationId: reminder ? reminder.notificationId : [],
                    time: reminder ? reminder.time : '',
                    repeatDays: reminder ? reminder.repeatDays : [],
                    reminderType: reminder ? reminder.reminderType : [],
                    notes: reminder ? reminder.notes : '',
                    isEnabled: reminder ? reminder.isEnabled : false,
                }}
                setFormValue={setReminder}
            >
                {({ values, handleSubmit }) => (
                    <View style={styles.customButtonContainer}>
                        <CustomButton
                            title='Simpan Perubahan'
                            size='lg'
                            onPress={() => {
                                handleSubmit();
                                handleSaveReminder(values);
                            }}
                        />
                        <CustomButton
                            title='Hapus log'
                            size='lg'
                            onPress={() => {
                                handleDeleteMedicineLog(values.id);
                                router.navigate('/(notes)/reminder/');
                            }}
                        />
                    </View>
                )}
            </ReminderForm>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f8f9',
    },
    customButtonContainer: {
        height: 150,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    }
});
