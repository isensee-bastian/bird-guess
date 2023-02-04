import * as rm from 'typed-rest-client/RestClient';
import * as fs from 'fs';
import * as https from 'https';

//
// This script automates fetching of bird sound recordings from xeno-canto.
//
// Ideas for future improvement:
// * Consider filtering for best quality.
// * Consider relaxing length filter if more results are needed.
// * Consider checking the file type either with a library or by looking at the file-name ending.
//

// Fields which we do not need right now have been omitted.
interface RawResponse {
    recordings: RawRecording[],
}

// Fields which we do not need right now have been omitted.
interface RawRecording {
    en: string,
    type: string,
    url: string,
    file: string,
    lic: string,
    q: string,
    length: string,
}

// Represents prepared recording meta data for further processing.
class Recording {
    name: string; // Name of the bird in english.
    type: string;
    url: string;
    fileUrl: string;
    licenseUrl: string;
    quality: string;
    length: string;

    constructor(recording: RawRecording) {
        // For some reason the provided URL and licencse URL start with // and
        // don't have an https: prefix. Therefore, we add it here.
        this.name = recording.en;
        this.type = recording.type;
        this.url = `https:${recording.url}`;
        this.fileUrl = recording.file;
        this.licenseUrl = `https:${recording.lic}`;
        this.quality = recording.q;
        this.length = recording.length;
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
    const response = await client.get<RawResponse>(url);

    if (response.statusCode !== 200) {
        return Promise.reject(`Unexpected status code received for url ${url} : ${response.statusCode}`);
    }

    if (!response.result || !response.result.recordings || !response.result.recordings.length) {
        return Promise.reject(`No recording results found for url ${url}`);
    }

    return Promise.resolve(new Recording(response.result.recordings[0]));
}

async function downloadRecording(targetDir: string, recording: Recording): Promise<void> {
    if (recording.name.trim().length < 2) {
        return Promise.reject('Bird name to use in file name must have at least two characters');
    }

    const fileName = recording.name.trim().replace(/(\s+)/g, '_').toLowerCase();
    const filePath = `${targetDir}/${fileName}.mp3`;
    const file = fs.createWriteStream(filePath);

    return new Promise<void>((resolve, reject) => {
        https.get(recording.fileUrl, function (response) {
            if (response.statusCode !== 200) {
                reject(`Unexpected status code received for url ${recording.fileUrl} : ${response.statusCode}`);
            }

            response.pipe(file);

            file.on('finish', () => {
                file.close();
                console.log(`Downloaded ${filePath}`);
                resolve();
            });
        });
    });
}

async function main() {
    const targetDir = '/home/bisensee';
    try {
        const recording = await fetchRecordingMeta('Pileated Woodpecker');
        await downloadRecording(targetDir, recording);
    } catch (err) {
        console.error(err);
    }
}

main();