type ReminderFormValues = {
    id: string,
    notificationId: string[],
    reminderType: number[];
    time: string;
    repeatDays: number[];
    notes: string,
    isEnabled: boolean;
}

type DayItem = {
    id: number;
    day: string;
    value: number;
};

type StoredData = {
    [key: string]: ReminderFormValues; 
};