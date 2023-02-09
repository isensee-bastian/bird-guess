import fetchImageData, { ImageResult } from './fetchWiki';
import fetchSoundData, { SoundResult } from './fetchXeno';

const TARGET_DIR = '/home/bisensee/repos/birds/download_test';

interface Bird {
    name: string,
    image: ImageResult,
    sound: SoundResult,
}

const birds = ['Blue jay', 'Black-browned albatross', 'Northern cardinal', 'Peregrine falcon', 'Pileated woodpecker', 'Short-eared owl'];

async function main() {
    for (let index in birds) {
        const bird = birds[index];
        try {
            const image = await fetchImageData(bird, TARGET_DIR);
            const sound = await fetchSoundData(bird, TARGET_DIR);
            const entry = { name: bird, image: image, sound: sound };
            console.log(entry);
        } catch (exception) {
            console.error(exception)
        }
    }
}

main();