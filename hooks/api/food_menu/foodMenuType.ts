type FoodMenu = {
    id: number,
    title: string,
    duration: string,
    portion: string,
    ingredients: string,
    steps: string,
    image: string,
    calories: number,
    protein: number,
    carbohydrate: number,
    fat: number,
    is_saved: boolean,
}

type SaveMenuRequest = {
    menu_id: number
}