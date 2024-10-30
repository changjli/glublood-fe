type StoreMedicineLogReq = {
    date: string,
    name: string,
    time: string,
    amount: number,
    type: string,
    notes: string,
}

type GetMedicineLogRes = {
    id: number,
    date: string,
    name: string,
    time: string,
    amount: number,
    type: string,
    notes: string,
}

type UpdateMEdicineLogReq = {
    id: number,
    date: string,
    name: string,
    time: string,
    amount: number,
    type: string,
    notes: string,
}