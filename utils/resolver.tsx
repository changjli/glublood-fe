import { Colors } from "@/constants/Colors"

export function resolveNumberToString(number: number) {
    const numberNames = ['Pertama', 'Kedua', 'Ketiga', 'Keempat', 'Kelima']
    return numberNames[number]
}

export function resolveMonthAbbreviation(month: number) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des']
    return monthNames[month]
}

export function resolveTimingColor(timing: string) {
    if (timing == 'pagi') {
        return Colors.light.green400
    } else if (timing == 'siang') {
        return Colors.light.yellow300
    } else if (timing == 'sore') {
        return Colors.light.orange300
    } else if (timing == 'malam') {
        return Colors.light.blue400
    } else if (timing == 'waktu tidur') {
        return Colors.light.purple400
    } else {
        return 'white'
    }
}