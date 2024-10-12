type StoreExerciseLogReq = {
    exercise_name: string
    date: string
    start_time: string
    end_time: string
    burned_calories: number
}

type GetExerciseLogRes = {
    id: number
    date: string
    start_time: string
    end_time: string
    burned_calories: number
    exercise_name: string
}

type UpdateExerciseLogReq = {
    id: number
    exercise_name: string
    date: string
    start_time: string
    end_time: string
    burned_calories: number
}