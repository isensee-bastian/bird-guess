import fetchImageData from './fetchWiki';
import fetchSoundData from './fetchXeno';
import * as fs from 'fs';
import * as path from 'path';
import { ImageMeta, SoundMeta } from '../models/Meta';


//
// This script combines automated fetching of bird sound and images by name.
//
// Ideas for future improvement:
// * Consider using a large bird list as input: https://en.wikipedia.org/wiki/List_of_birds_by_common_name
// * Consider using a random mechanism of a page like xeno canto for input.
//

const TARGET_DIR = '/home/bisensee/repos/birds/public/assets/birds';

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

const birds = [
    'Blue jay',
    'Black-browned albatross',
    'Northern cardinal',
    'Peregrine falcon',
    'Pileated woodpecker',
    'Short-eared owl',
    'Acorn woodpecker',
    'American black duck',
    'American coot',
    'American goldfinch',
    'American woodcock',
    'Annas hummingbird',
    'Atlantic puffin',
    'Bald eagle',
    'Barred owl',
    'Barn owl',
    'Black oystercatcher',
    'Brant',
    'California scrub jay',
    'Common ground dove',
    'Common raven',
    'Dickcissel',
    'Dunlin',
    'Elegant tern',
    'Glossy ibis',
    'Great black-backed gull',
    'Great egret',
    'Greater scaup',
    'King rail',
    'Lucifer hummingbird',
    'Monk parakeet',
    'Painted bunting'
];

async function fetch(): Promise<FetchResult> {
    const loaded: Bird[] = []
    const failed: Failure[] = []

    for (let index in birds) {
        const bird = birds[index];

        let image: ImageMeta | null = null;
        let sound: SoundMeta | null = null;

        try {
            image = await fetchImageData(bird, TARGET_DIR);
            sound = await fetchSoundData(bird, TARGET_DIR);
            loaded.push({ name: bird, image: image, sound: sound });
        } catch (exception) {
            console.error(`Fetching failed for ${bird}: ${exception}`);
            failed.push({ name: bird, error: `${exception}` })
            // Cleanup possibly downloaded files to avoid inconsistencies.
            cleanupFailedDownload(image, sound);
        }
    }

    return { loaded: loaded, failed: failed }
}

function cleanupFailedDownload(image: ImageMeta | null, sound: SoundMeta | null) {
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

async function main() {
    console.log(`Starting bird fetching`);
    const result = await fetch();

    console.log(``);
    console.log(`Fetching done`);
    console.log(`Failed downloads:`);
    console.log(result.failed);

    console.log(``);
    console.log(`Writing index file`);
    const indexFile = path.join(TARGET_DIR, 'birds.json');
    fs.writeFileSync(indexFile, JSON.stringify(result.loaded, null, 4), 'utf-8');

    console.log(`Finished bird fetching`);
}

main();