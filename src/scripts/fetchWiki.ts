import * as rm from 'typed-rest-client/RestClient.js';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as jsdom from 'jsdom';
import { ImageMeta } from '../models/Meta.js';

//
// This script automates fetching of bird images from wikipedia.
//
// Ideas for future improvement:
// * Consider checking the file type either with a library or by looking at the file-name ending (for now we are assuming jpg).
// * Consider fetching (or converting to) smaller images to save storage space.
//

const USER_AGENT = 'bird-guess-scripts/0.1.0 (daniel.schulz1590@protonmail.com)';

const CLIENT_OPTIONS = {
    headers: {
        'User-Agent': USER_AGENT,
    }
};

interface Attribution {
    artist: string;
    license: string;
}

// Wikimedia API requires a descriptive user agent with contact information.
// User-Agent
// Example: MyCoolTool/1.1 (https://example.org/MyCoolTool/; MyCoolTool@example.org) UsedBaseLibrary/1.4'
// The generic format is <client name>/<version> (<contact information>) <library/framework name>/<version> [<library name>/<version> ...]

// Get page title by search:
// https://en.wikipedia.org/w/api.php?action=opensearch&search=Blue%20jay&limit=1&namespace=*&format=json
// ["Blue jay",["Blue jay"],[""],["https://en.wikipedia.org/wiki/Blue_jay"]]
// Second array contains page titles

// Get main image by page tite:
// https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=Blue%20jay
// {"batchcomplete":"","query":{"pages":{"213498":{"pageid":213498,"ns":0,"title":"Blue jay","original":{"source":"https://upload.wikimedia.org/wikipedia/commons/f/f4/Blue_jay_in_PP_%2830960%29.jpg","width":3319,"height":4526}}}}}
// query.pages.213498.original.source (ID is the page ID)


// Get license and attribution terms by file name:
// https://en.wikipedia.org/w/api.php?action=query&prop=imageinfo&iiprop=extmetadata&titles=File%3aBlue_jay_in_PP_%2830960%29.jpg&format=json
// See separate json file for example response.

// Example attribution: By Rhododendrites - Own work, CC BY-SA 4.0, https://commons.wikimedia.org/w/index.php?curid=103770921
// query.pages.value.-1.imageinfo.extmetadata. -> Artist.value (tag value) + Credit + LicenseShortName + ?

async function fetchImageUrl(pageTitle: string): Promise<string> {
    if (pageTitle.length < 2) {
        return Promise.reject('Page title to get main image for must have at least two characters');
    }

    const queryTitle = pageTitle.trim().replace(/(\s{1})/g, '%20');
    const client = new rm.RestClient(USER_AGENT);
    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${queryTitle}`;

    const response = await client.get<any>(url);

    if (response.statusCode !== 200) {
        return Promise.reject(`Unexpected status code received for url ${url} : ${response.statusCode}`);
    }

    if (!response.result) {
        return Promise.reject(`No result found for url ${url}`);
    }

    let source = "";
    const fieldFn = function (key: string, value: any): boolean {
        if (key === 'source') {
            source = value;
            return true;
        }

        return false;
    };

    traverse(response.result, fieldFn);

    if (source.length <= 0) {
        return Promise.reject(`Could not find main image URL: source field is either not present or value is empty`);
    }
    console.log(`Found main image URL ${source}`);

    return source;
}

async function fetchAttribution(imageUrl: string): Promise<Attribution> {
    if (!imageUrl) {
        return Promise.reject('Image URL to fetch attribution for must not be empty');
    }

    const start = imageUrl.lastIndexOf('/');
    if (start < 0 || (start + 1 >= imageUrl.length - 1)) {
        return Promise.reject(`Could not find file name in URL ${imageUrl}`);
    }

    const fileName = imageUrl.substring(start + 1);
    if (!fileName) {
        return Promise.reject(`Could not find file name in URL ${imageUrl}`);
    }
    console.log(`Fetching attribution for ${fileName}`);

    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=imageinfo&iiprop=extmetadata&titles=File%3a${fileName}&format=json`;
    const client = new rm.RestClient(USER_AGENT);
    const response = await client.get<any>(url);

    if (response.statusCode !== 200) {
        return Promise.reject(`Unexpected status code received for url ${url} : ${response.statusCode}`);
    }

    if (!response.result) {
        return Promise.reject(`No result found for url ${url}`);
    }

    let artist = "";
    let license = "";
    const fieldFn = function (key: string, value: any): boolean {
        if (!value.value) {
            return false;
        }

        if (key === 'Artist') {
            artist = parseArtist(value.value as string);
        } else if (key === 'LicenseShortName') {
            license = value.value as string;
        }

        if (artist && license) {
            return true;
        }

        return false;
    };

    traverse(response.result, fieldFn);

    if (artist.length <= 0) {
        return Promise.reject(`Could not find artist: field is either not present or value is empty`);
    }
    if (license.length <= 0) {
        return Promise.reject(`Could not find license: field is either not present or value is empty`);
    }

    console.log(`Found attribution ${artist} / ${license}`);

    return { artist: artist, license: license };
}

function parseArtist(text: string): string {
    // Unfortunately, the format of the artist value varies widely. It can be plain text or html with different nested elements.
    if (text && text.startsWith('<')) {
        // Parse value of innermost html element.
        const dom = new jsdom.JSDOM(text);
        const leaves = Array.from(dom.window.document.querySelectorAll('body *'))
            .filter(e => !e.children.length);

        if (leaves.length) {
            return leaves[0].innerHTML;
        }
    } else {
        // Assume this is plain text.
        return text;
    }

    return "";
}

async function downloadImage(targetDir: string, url: string, title: string): Promise<string> {
    if (!title || title.trim().length < 2) {
        return Promise.reject('Title to use in file name must have at least two characters');
    }
    if (!url) {
        return Promise.reject('URL to fetch image from must not be empty');
    }

    const fileName = title.trim().replace(/(\s+)/g, '_').toLowerCase() + '.jpg';
    const filePath = path.join(targetDir, fileName);
    const file = fs.createWriteStream(filePath);

    return new Promise<string>((resolve, reject) => {
        https.get(url, CLIENT_OPTIONS, function (response) {
            if (response.statusCode !== 200) {
                reject(`Unexpected status code received for url ${url} : ${response.statusCode}`);
                file.close();
                return;
            }

            response.pipe(file);

            file.on('finish', () => {
                file.close();
                console.log(`Downloaded ${filePath}`);
                resolve(fileName);
            });
        }).on('error', function (err) {
            fs.unlinkSync(filePath);
            file.close();
            reject(`Error on donwloading image from url ${url}: ${err}`);
        });
    });
}

function traverse(obj: any, fieldFn: (key: string, value: any) => boolean): void {
    for (let key in obj) {
        const value = obj[key];

        if (!value) {
            continue;
        }

        const stop = fieldFn(key, value);

        if (stop) {
            break;
        } else if (typeof (value) === 'object') {
            traverse(value, fieldFn);
        }
    }
}

async function fetchPageTitle(term: string): Promise<string> {
    if (term.trim().length < 2) {
        return Promise.reject('Page to search for must have at least two characters');
    }

    const client = new rm.RestClient(USER_AGENT);
    const queryTerm = term.trim().replace(/(\s{1})/g, '%20');
    const url = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${queryTerm}&limit=1&namespace=*&format=json`;

    console.log(`Searching for ${queryTerm}`);
    const response = await client.get<any[]>(url);

    if (response.statusCode !== 200) {
        return Promise.reject(`Unexpected status code received for url ${url} : ${response.statusCode}`);
    }

    if (!response.result || response.result.length < 2 || response.result[1].length < 1) {
        return Promise.reject(`No result found for url ${url}`);
    }

    const title = response.result[1][0];
    console.log(`Found title ${title}`);

    return title;
}

async function fetchImageData(searchTerm: string, targetDir: string): Promise<ImageMeta> {
    const title = await fetchPageTitle(searchTerm);
    const url = await fetchImageUrl(title);
    const attribution = await fetchAttribution(url);
    // Perform download as a last step to avoid leaving files when other steps failed (e.g. attribution not found).
    const fileName = await downloadImage(targetDir, url, searchTerm);

    return { fileName: fileName, fileUrl: url, article: title, artist: attribution.artist, license: attribution.license };
}

export default fetchImageData;