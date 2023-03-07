import * as fs from 'fs';


//
// This script shuffles all elements in a given json array read from a source file and writes the result to a
// specified target file.
//
// Ideas for future improvement:
// * Reduce duplication by importing random functions from the util package (first attempt failed due to module issues previously).
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
    if (process.argv.length < 4) {
        console.error("Expected input and output file as arguments");
        return;
    }

    const sourceFile = process.argv[2];
    if (!fs.existsSync(sourceFile)) {
        console.error(`Source file ${sourceFile} does not exist`);
        return;
    }

    const content = fs.readFileSync(sourceFile, { encoding: 'utf-8' });
    const array = JSON.parse(content) as string[];

    const shuffled = shuffle(array);

    const targetFile = process.argv[3];
    console.log(`Writing ${shuffled.length} shuffled elements to ${targetFile}`);

    fs.writeFileSync(targetFile, JSON.stringify(shuffled, null, 4), 'utf-8');
}

main();