type StoreExerciseLogReq = {
    exercise_name: string
    date: string
    start_time: string
    end_time: string
    burned_calories: number
}

type GetExerciseLogRes = {
    date: string
    start_time: string
    end_time: string
    burned_calories: number
    exercise_name: string
}