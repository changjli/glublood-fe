type StoreMedicineLogReq = {
    date: Date,
    name: string,
    time: string,
    amount: number,
    type: string,
    notes: string,
}

type GetMedicineLogRes = {
    id: number,
    date: Date,
    name: string,
    time: string,
    amount: number,
    type: string,
    notes: string,
}

type UpdateMEdicineLogReq = {
    id: number,
    date: Date,
    name: string,
    time: string,
    amount: number,
    type: string,
    notes: string,
}