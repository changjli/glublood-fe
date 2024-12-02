import { useState } from "react";
import useAsyncStorage from "./useAsyncStorage";

export type GlucoseLogNewEntryNotification = {
    date: string
    count: number
}

const STORAGE_KEY = 'glucose_log_new_entry_notification'

export function useGlucoseNewEntriesNotification() {
    const { storeObjectData, getObjectData } = useAsyncStorage()

    const [notifications, setNotifications] = useState<GlucoseLogNewEntryNotification[]>([])

    const storeNotifications = async (data: StoreGlucoseLogReq[]) => {
        const notifications = data.reduce((acc: GlucoseLogNewEntryNotification[], curr) => {
            const exists = acc.find(a => a.date == curr.date)
            if (exists) {
                exists.count += 1
            } else {
                acc.push({ date: curr.date, count: 1 })
            }
            return acc
        }, [])
        console.log('simpan', notifications)
        await storeObjectData(STORAGE_KEY, { items: notifications })
    }

    const getNotifications = async () => {
        const notifications = await getObjectData(STORAGE_KEY)
        console.log('notifications', notifications)
        setNotifications(notifications.items as GlucoseLogNewEntryNotification[])
    }

    const getNotificationByDate = (date: number) => {
        if (notifications.length > 0) {
            return notifications.find(notification => new Date(notification.date).getDate() == date)
        }
    }

    const deleteNotificationByDate = async (date: number) => {
        const temp = notifications.filter(notification => new Date(notification.date).getDate() != date)
        console.log('delete', temp)
        await storeObjectData(STORAGE_KEY, { items: temp })
        getNotifications()
    }

    return {
        notifications,
        storeNotifications,
        getNotifications,
        getNotificationByDate,
        deleteNotificationByDate,
    }

}