export function getRandomNumber(max: number) {
    return Math.floor(Math.random() * max);
}

export function convertMinutes(minutes: number) {
    const hours = Math.floor(minutes / 60);
    return `${hours > 0 ? `${hours} h ` : ''}${minutes % 60 } min`
}
