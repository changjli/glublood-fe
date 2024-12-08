export type predictionRequest = {
    "high_bp": number,
    "high_chol": number,
    "chol_check": number,
    "bmi": number,
    "smoker": number,
    "stroke": number,
    "heart_disease": number,
    "phys_activity": number,
    "fruits": number,
    "veggies": number,
    "hvy_alcohol": number,
    "any_healthcare": number,
    "no_doc": number,
    "gen_health": number,
    "mental_health": number,
    "phys_health": number,
    "diff_walk": number,
    "sex": number,
    "age": number
}

export type predictionResponse = {
    result: number,
}


