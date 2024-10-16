type GetFoodLogResponse = {
    id: number
    date: string
    time: string
    food_name: string
    calories: number
    protein: number
    carbohydrate: number
    fat: number
    serving_qty: number
    serving_size: number
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
    type: string
}

type UpdateFoodLogReq = {
    id: number
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
    type: string
}
