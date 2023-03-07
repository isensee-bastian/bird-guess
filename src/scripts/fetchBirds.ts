// Note: For some reason the imports need to end with .js even in the typescript file.
// Otherwise, transpiled js files will throw module import errors when running with npm.
// After a lot of trial and error with several tsconfig.json settings following hint gave the insight: https://github.com/microsoft/TypeScript/issues/41887
import fetchImageData from './fetchWiki.js';
import fetchSoundData from './fetchXeno.js';
import * as fs from 'fs';
import * as path from 'path';
import { ImageMeta, SoundMeta } from '../models/Meta.js';


//
// This script combines automated fetching of bird sound and images by name.
//
// How to use:
// * Go to this files directory.
// * Compile typescript files: tsc --project ./tsconfig.json
// * Run this script with node and specify a file containing bird names to search for as a json array and a target directory for download:
//   node fetchBirds.js /home/bisensee/repos/birds/public/assets/birds/ 
//

interface Bird {
    name: string;
    image: ImageMeta;
    sound: SoundMeta;
}

interface Failure {
    name: string;
    error: string;
}

interface FetchResult {
    loaded: Bird[];
    failed: Failure[];
}

async function fetch(birdNames: string[], targetDir: string): Promise<FetchResult> {
    const loaded: Bird[] = []
    const failed: Failure[] = []

    for (let index in birdNames) {
        const bird = birdNames[index];

        let image: ImageMeta | null = null;
        let sound: SoundMeta | null = null;

        try {
            image = await fetchImageData(bird, targetDir);
            sound = await fetchSoundData(bird, targetDir);
            loaded.push({ name: bird, image: image, sound: sound });
        } catch (exception) {
            console.error(`Fetching failed for ${bird}: ${exception}`);
            failed.push({ name: bird, error: `${exception}` })
            // Cleanup possibly downloaded files to avoid inconsistencies.
            cleanupFailedDownload(targetDir, image, sound);
        }
    }

    return { loaded: loaded, failed: failed }
}

function cleanupFailedDownload(targetDir: string, image: ImageMeta | null, sound: SoundMeta | null) {
    if (image && image.fileName) {
        const imagePath = path.join(targetDir, image.fileName);
        console.log(`Removing ${imagePath} due to fetch error`);
        fs.unlinkSync(imagePath);
    }
    if (sound && sound.fileName) {
        const soundPath = path.join(targetDir, sound.fileName);
        console.log(`Removing ${soundPath} due to fetch error`);
        fs.unlinkSync(soundPath);
    }
}

async function main() {
    if (process.argv.length < 4) {
        console.error("Expected bird names file and target directory as argument");
        return;
    }

    const namesArrayFile = process.argv[2];
    if (!fs.existsSync(namesArrayFile)) {
        console.error(`Bird names file ${namesArrayFile} does not exist`);
        return;
    }

    const content = fs.readFileSync(namesArrayFile, { encoding: 'utf-8' });
    const birdNames = JSON.parse(content) as string[];

    const targetDir = process.argv[3];
    if (!fs.existsSync(targetDir)) {
        console.error(`Target directory ${targetDir} does not exist`);
        return;
    }

    console.log(`Starting bird fetching`);
    const result = await fetch(birdNames, targetDir);

    console.log(``);
    console.log(`Fetching done`);
    console.log(`Failed downloads:`);
    console.log(result.failed);

    console.log(``);
    console.log(`Writing index file`);
    const indexFile = path.join(targetDir, 'birds.json');
    fs.writeFileSync(indexFile, JSON.stringify(result.loaded, null, 4), 'utf-8');

    console.log(`Finished bird fetching`);
}

main();