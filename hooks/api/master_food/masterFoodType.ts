type SearchMasterFoodResponse = {
    id: number
    food_name: string
}

type GetMasterFoodDetailResponse = {
    id: number
    food_name: string
    calories: number
    fat: number
    carbohydrate: number
    protein: number
    image: string | null
    brand: string
    serving_qty: number
    serving_size: string
    cholestrol: number
    fiber: number
    sugar: number
    sodium: number
    kalium: number
    categories: string
}