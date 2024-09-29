type GetDailyCaloriesResponse = {
    date: string
    daily_calories: number
}

type StoreDailyCaloriesRequest = {
    date: string
    total_calories: number
}