type StoreGlucoseLogReq = {
    date: string,
    glucose_rate: number,
    time: string,
    time_selection: string,
    notes: string,
    type: string,
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
    type: string,
}

type GetGlucoseLogReportByDateRes = {
    date: string
    avg_glucose_rate: number
    log_count: number
}

type GetGlucoseLogReportByMonthRes = {
    week_range: string
    avg_glucose_rate: number
    log_count: number
}

type GetGlucoseLogReportByYearhRes = {
    month: string
    avg_glucose_rate: number
    log_count: number
}