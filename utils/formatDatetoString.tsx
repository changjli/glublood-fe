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

export function formatDateStripToSlash(dateStr: string) {
    const date = new Date(dateStr);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const formattedDate = `${month}/${day}`;
    return formattedDate
}

export function formatDateToDay(dateStr: string) {
    const date = new Date(dateStr);
    const daysOfWeek = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const dayName = daysOfWeek[date.getDay()];
    return dayName
}

export const formatDateIntl = (date: string) => {
    return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(date))
}