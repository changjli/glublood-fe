export type predictionRequest = {
    pregnancies: number,
    glucose: number,
    blood_pressure: number,
    skin_thickness: number,
    insulin: number,
    weight: number,
    height: number,
    bmi: number,
    is_father: number,
    is_mother: number,
    is_sister: number,
    is_brother: number,
    age: number,
}

export type predictionResponse = {
    result: number,
}


