
export function join(first: string, second: string): string {
    if (first.endsWith('/')) {
        return first + second;
    }

    return first + '/' + second;
}