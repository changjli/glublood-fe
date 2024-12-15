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
    serving_size: string
    note: string
    type: string
    img: string
    brand: string
    cholestrol: number
    fiber: number
    sugar: number
    sodium: number
    kalium: number
}

type PostFoodLogRequest = {
    id?: number
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
    brand?: string
    cholestrol?: number
    fiber?: number
    sugar?: number
    sodium?: number
    kalium?: number
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

type GetFoodLogReportByDateRes = {
    date: string
    avg_calories: number
    log_count: number
}

type GetFoodLogReportByMonthRes = {
    week_range: string
    avg_calories: number
    log_count: number
}

type GetFoodLogReportByYearhRes = {
    month: string
    avg_calories: number
    log_count: number
}