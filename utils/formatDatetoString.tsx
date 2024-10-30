export function formatDatetoString(date: Date) {
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function getDuration(startTime: string, endTime: string) {
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    const duration = end.getTime() - start.getTime();
    const durationInMins = duration / (1000 * 60);
    return durationInMins;
}