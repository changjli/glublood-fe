export function queryParamBuilder(queries: { [key: string]: any }) {
    let counter = 0
    return Object.keys(queries).reduce((acc, key) => {
        if (queries[key] != undefined && queries[key] != null && queries[key] != '' && queries[key] != 0) {
            if (counter == 0) {
                acc += `?${key}=${queries[key]}`
            } else {
                acc += `&${key}=${queries[key]}`
            }
            counter++
        }
        return acc
    }, '')
}