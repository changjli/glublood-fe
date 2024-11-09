export function resolveNumberToString(number: number) {
    const numberNames = ['Pertama', 'Kedua', 'Ketiga', 'Keempat', 'Kelima']
    return numberNames[number]
}

export function resolveMonthAbbreviation(month: number) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des']
    return monthNames[month]
}