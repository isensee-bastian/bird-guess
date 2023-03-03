// Note: For some reason the imports need to end with .js even in the typescript file.
// Otherwise, transpiled js files will throw module import errors when running with npm.
// After a lot of trial and error with several tsconfig.json settings following hint gave the insight: https://github.com/microsoft/TypeScript/issues/41887
import fetchImageData from './fetchWiki.js';
import fetchSoundData from './fetchXeno.js';
import * as fs from 'fs';
import * as path from 'path';
import { ImageMeta, SoundMeta } from '../models/Meta.js';
import birdNames from './birdNames.json' assert { type: "json" };


//
// This script combines automated fetching of bird sound and images by name.
//
// How to use:
// * Go to this files directory.
// * Compile typescript files: tsc --project ./tsconfig.json
// * Run this script file with node and specify a target directory for download: node fetchBirds.js /home/bisensee/repos/birds/public/assets/birds/ 
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

async function fetch(targetDir: string): Promise<FetchResult> {
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
    if (process.argv.length < 3) {
        console.error("Expected target directory as argument");
        return;
    }

    const targetDir = process.argv[2];
    if (!fs.existsSync(targetDir)) {
        console.error(`Target directory ${targetDir} does not exist`)
        return;
    }

    console.log(`Starting bird fetching`);
    const result = await fetch(targetDir);

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