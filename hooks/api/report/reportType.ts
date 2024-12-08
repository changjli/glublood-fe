type GetLogReportByDateReq = {
    start_date: string
    end_date: string
    food_log: boolean
    exercise_log: boolean
    glucose_log: boolean
    medicine_log: boolean
}

type GetLogReportByDateRes = {
    "date": string,
    "description": string,
    "avg_calories"?: number,
    "avg_burned_calories"?: number,
    "avg_glucose_rate"?: number,
    "medicine_details"?: string
}