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
    img?: string
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
    img?: string
}

type GetFoodByBarcodeReq = {
    barcode: string
}

type GetFoodByBarcodeRes = {
    code: string
    product: {
        brands: string
        categores: string
        image_url: string
        nutriments: {
            carbohydrates: number
            energy: number
            fat: number
            proteins: number
            calcium: number
            magnesium: number
            phosphorus: number
            potassium: number
            salt: number
            sodium: number
            sugars: number
            zinc: number
        }
        product_name: string
        serving_qty: number
    }
}
