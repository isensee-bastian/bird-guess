import * as rm from 'typed-rest-client/RestClient.js';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import { SoundMeta } from '../models/Meta.js';
import XenoResponseExample from './xenoResponseExample.json';

//
// This script automates fetching of bird sound recordings from xeno-canto.
//
// Ideas for future improvement:
// * Consider filtering for best quality.
// * Consider relaxing length filter if more results are needed.
// * Consider checking the file type either with a library or by looking at the file-name ending (for now we are assuming mp3).
//

// Represents prepared recording meta data for further processing.
class Recording {
    name: string; // Name of the bird in english.
    type: string;
    url: string;
    fileUrl: string;
    licenseUrl: string;
    quality: string;
    length: string;
    recordist: string;

    constructor(recording: typeof XenoResponseExample.recordings[0]) {
        // For some reason the provided URL and licencse URL start with // and
        // don't have an https: prefix. Therefore, we add it here.
        this.name = recording.en;
        this.type = recording.type;
        this.url = `https:${recording.url}`;
        this.fileUrl = recording.file;
        this.licenseUrl = `https:${recording.lic}`;
        this.quality = recording.q;
        this.length = recording.length;
        this.recordist = recording.rec;
    }
}

async function fetchRecordingMeta(name: string): Promise<Recording> {
    if (name.trim().length < 2) {
        return Promise.reject('Bird name to search for must have at least two characters');
    }

    const client = new rm.RestClient('test');
    const queryName = name.trim().replace(/(\s+)/g, '+').toLowerCase();
    // Search for matching bird recordings with sound file length between 10 and 25 seconds.
    const url = `https://www.xeno-canto.org/api/2/recordings?query=${queryName}+len:10-25`;

    console.log(`Searching for ${queryName}`);
    const response = await client.get<typeof XenoResponseExample>(url);

    if (response.statusCode !== 200) {
        return Promise.reject(`Unexpected status code received for url ${url} : ${response.statusCode}`);
    }

    if (!response.result || !response.result.recordings || !response.result.recordings.length) {
        return Promise.reject(`No recording results found for url ${url}`);
    }

    // Pick the first recording where file name is mp3. There can be wav files etc. that we want to skip.
    let chosen: typeof XenoResponseExample.recordings[0] | null = null

    for (let current of response.result.recordings) {
        if (current['file-name'].endsWith('mp3')) {
            chosen = current;
            break;
        }
    }

    if (!chosen) {
        return Promise.reject(`Could not find any recording where file name ends with mp3`);
    }

    const recording = new Recording(chosen);
    console.log(`Found recording: ${recording.name}`);

    return recording;
}

async function downloadRecording(targetDir: string, recording: Recording): Promise<string> {
    if (!recording.name || recording.name.trim().length < 2) {
        return Promise.reject('Bird name to use in file name must have at least two characters');
    }

    const fileName = recording.name.trim().replace(/(\s+)/g, '_').toLowerCase() + '.mp3';
    const filePath = path.join(targetDir, fileName);
    const file = fs.createWriteStream(filePath);

    return new Promise<string>((resolve, reject) => {
        https.get(recording.fileUrl, function (response) {
            if (response.statusCode !== 200) {
                reject(`Unexpected status code received for url ${recording.fileUrl} : ${response.statusCode}`);
                file.close();
                return;
            }

            response.pipe(file);

            file.on('finish', () => {
                file.close();
                console.log(`Downloaded ${filePath}`);
                resolve(fileName);
                return;
            });
        }).on('error', function (err) {
            fs.unlinkSync(filePath);
            file.close();
            reject(`Error on donwloading recording from url ${recording.fileUrl}: ${err}`);
        });
    });
}

async function fetchSoundData(searchTerm: string, targetDir: string): Promise<SoundMeta> {
    const recording = await fetchRecordingMeta(searchTerm);
    const fileName = await downloadRecording(targetDir, recording);

    return { fileName: fileName, fileUrl: recording.fileUrl, length: recording.length, recordist: recording.recordist, url: recording.url, licenseUrl: recording.licenseUrl };
}

export default fetchSoundData;