
// Fisher-Yates algorithm adapted from: https://bost.ocks.org/mike/shuffle/
export function shuffle<Type>(allElements: Type[]): Type[] {
    if (!allElements) {
        return allElements;
    }

    const elements = allElements.slice(0);

    let remaining = elements.length;
    while (remaining) {
        const random = randomInt(remaining);
        remaining -= 1;

        const temp = elements[remaining];
        elements[remaining] = elements[random];
        elements[random] = temp;
    }

    return elements;
}

export function randomInt(maxExclusive: number): number {
    return Math.floor(Math.random() * maxExclusive);
}

export function randomIndexArray(maxExclusive: number, count: number): number[] {
    const result: number[] = [];

    for (let index = 0; index < count; index++) {
        result.push(randomInt(maxExclusive));
    }

    return result;
}
