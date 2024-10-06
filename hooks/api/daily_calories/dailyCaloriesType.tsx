type GetDailyCaloriesResponse = {
    date: string
    consumed_calories: number
    target_calories: number
}

type StoreDailyCaloriesRequest = {
    date: string
    consumed_calories: number
    target_calories: number
}