export function formatDecimalToFixed(num: number | undefined) {
    if (num) {
        return Number.isInteger(Number(num)) ? Number(num) : Number(num).toFixed(2)
    } else {
        return 0
    }
}