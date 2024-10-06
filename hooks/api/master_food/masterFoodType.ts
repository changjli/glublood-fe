type SearchMasterFoodResponse = {
    id: number
    food_name: string
}

type GetMasterFoodDetailResponse = {
    id: number
    food_name: string
    calorie: string
    fat: string
    carbohydrate: string
    protein: string
    image: string | null
    brand: string
    portion: string
    cholestrol: string
    fiber: string
    sugar: string
    sodium: string
    kalium: string
    categories: string
}