type StoreGlucoseLogReq = {
    date: string,
    glucose_rate: number,
    time: string,
    time_selection: string,
    notes: string,
}

type GetGlucoseLogRes = {
    id: number,
    date: string,
    glucose_rate: number,
    time: string,
    time_selection: string,
    notes: string,
}

type UpdateGlucoseLogReq = {
    id: number,
    date: string,
    glucose_rate: number,
    time: string,
    time_selection: string,
    notes: string,
}