import * as fs from 'fs';
import * as cheerio from 'cheerio';

//
// This script extracts bird names from a given html file.
//

function main() {
    if (process.argv.length < 4) {
        console.error("Expected input and output files as arguments");
        return;
    }

    const sourceFile = process.argv[2];
    if (!fs.existsSync(sourceFile)) {
        console.error(`Source file ${sourceFile} does not exist`)
        return;
    }

    const html = fs.readFileSync(sourceFile, { encoding: 'utf-8' });
    const tree = cheerio.load(html);
    const elements = tree('.bird-outer > div > a > span');

    const names = elements.map(function (_, element) {
        return tree(element).text();
    }).toArray().map(function (name) {
        // Some longer names contain line breaks and tabs that need to be replaced.
        return name.trim().replace(/[\t\n]+/g, ' ');
    });

    const targetFile = process.argv[3];
    console.log(`Writing ${names.length} names to ${targetFile}`);

    fs.writeFileSync(targetFile, JSON.stringify(names, null, 4), 'utf-8');
}

main();