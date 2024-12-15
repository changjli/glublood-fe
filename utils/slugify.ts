export function slugify(keyword: string) {
    return keyword
        .toLowerCase()
        .split(" ")
        .join("-");
}