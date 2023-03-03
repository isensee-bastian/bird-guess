import * as fs from 'fs';


//
// This script picks a given amount of random elements from a larger json array (e.g. bird names).
//
// Ideas for future improvement:
// * Reduce duplication by importing random functions from the util package (failed due to module issues previously).
// * Avoid shuffling all elements when only a subset is required.
//

// Fisher-Yates algorithm adapted from: https://bost.ocks.org/mike/shuffle/
function shuffle<Type>(allElements: Type[]): Type[] {
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

function randomInt(maxExclusive: number): number {
    return Math.floor(Math.random() * maxExclusive);
}

function main() {
    if (process.argv.length < 5) {
        console.error("Expected input file, output file and number of elements to choose as arguments");
        return;
    }

    const sourceFile = process.argv[2];
    if (!fs.existsSync(sourceFile)) {
        console.error(`Source file ${sourceFile} does not exist`)
        return;
    }

    const content = fs.readFileSync(sourceFile, { encoding: 'utf-8' });
    const array = JSON.parse(content) as string[];

    const count = Number(process.argv[4]);
    if (isNaN(count)) {
        console.error(`Number of elements to choose ${process.argv[4]} is not a number`)
        return;
    }

    if (count < 1 || count > array.length) {
        console.error(`Number of elements to choose ${count} is out of range, must be >= 1 and <= ${array.length}`)
        return;
    }

    const chosen = shuffle(array).slice(0, count);

    const targetFile = process.argv[3];
    console.log(`Writing ${count} elements to ${targetFile}`);

    fs.writeFileSync(targetFile, JSON.stringify(chosen, null, 4), 'utf-8');
}

main();