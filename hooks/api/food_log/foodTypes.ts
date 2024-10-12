type GetFoodLogResponse = {
    id: number
    date: string
    time: string
    food_name: string
    calories: string
    protein: string
    carbohydrate: string
    fat: string
    serving: string
}

type StoreFoodLogRequest = {
    date: string
    time: string
    food_name: string
    calories: number
    protein: number
    carbohydrate: number
    fat: number
    serving_qty: number
    serving_size: string
    note: string
    type: number
}
