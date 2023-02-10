import fetchImageData, { ImageResult } from './fetchWiki';
import fetchSoundData, { SoundResult } from './fetchXeno';
import * as fs from 'fs';
import * as path from 'path';

const TARGET_DIR = '/home/bisensee/repos/birds/download_test';

interface Bird {
    name: string,
    image: ImageResult,
    sound: SoundResult,
}

interface Failure {
    name: string,
    error: string,
}

const birds = ['Blue jay', 'Black-browned albatross', 'Northern cardinal', 'Peregrine falcon', 'Pileated woodpecker', 'Short-eared owl'];

async function main() {
    console.log(`Starting bird fetching`);
    const entries: Bird[] = []
    const failed: Failure[] = []

    for (let index in birds) {
        const bird = birds[index];

        let image: ImageResult | null = null;
        let sound: SoundResult | null = null;

        try {
            image = await fetchImageData(bird, TARGET_DIR);
            sound = await fetchSoundData(bird, TARGET_DIR);
            entries.push({ name: bird, image: image, sound: sound });
        } catch (exception) {
            console.error(`Fetching failed for ${bird}: ${exception}`);
            failed.push({ name: bird, error: `${exception}` })

            // Cleanup possibly downloaded files to avoid inconsistencies.
            if (image && image.fileName) {
                const imagePath = path.join(TARGET_DIR, image.fileName);
                console.log(`Removing ${imagePath} due to fetch error`);
                fs.unlinkSync(imagePath);
            }
            if (sound && sound.fileName) {
                const soundPath = path.join(TARGET_DIR, sound.fileName);
                console.log(`Removing ${soundPath} due to fetch error`);
                fs.unlinkSync(soundPath);
            }
        }
    }

    console.log(``);
    console.log(`Fetching done`);
    console.log(`Failed downloads:`);
    console.log(failed);

    console.log(``);
    console.log(`Writing index file`);
    const indexFile = path.join(TARGET_DIR, 'birds.json');
    fs.writeFileSync(indexFile, JSON.stringify(entries, null, 4), 'utf-8');

    console.log(`Finished bird fetching`);
}

main();