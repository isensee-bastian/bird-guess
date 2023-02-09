"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var rm = require("typed-rest-client/RestClient");
var fs = require("fs");
var https = require("https");
//
// This script automates fetching of bird images from wikipedia.
//
// Ideas for future improvement:
// * Consider checking the file type either with a library or by looking at the file-name ending (for now we are assuming jpg).
// * Consider fetching (or converting to) smaller images to save storage space.
//
var USER_AGENT = 'BirdScript/0.1 (daniel.schulz1590@protonmail.com)';
var CLIENT_OPTIONS = {
    headers: {
        'User-Agent': USER_AGENT
    }
};
// Wikimedia API requires a descriptive user agent with contact information.
// User-Agent
// Example: MyCoolTool/1.1 (https://example.org/MyCoolTool/; MyCoolTool@example.org) UsedBaseLibrary/1.4'
// The generic format is <client name>/<version> (<contact information>) <library/framework name>/<version> [<library name>/<version> ...]
// 
// BirdScript/0.1 (daniel.schulz1590@protonmail.com)
// Get page title by search:
// https://en.wikipedia.org/w/api.php?action=opensearch&search=Blue%20jay&limit=1&namespace=*&format=json
// ["Blue jay",["Blue jay"],[""],["https://en.wikipedia.org/wiki/Blue_jay"]]
// Second array contains page titles
// Get main image by page tite:
// http://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=Blue%20jay
// {"batchcomplete":"","query":{"pages":{"213498":{"pageid":213498,"ns":0,"title":"Blue jay","original":{"source":"https://upload.wikimedia.org/wikipedia/commons/f/f4/Blue_jay_in_PP_%2830960%29.jpg","width":3319,"height":4526}}}}}
// query.pages.213498.original.source (ID is the page ID)
// Get license and attribution terms by file name:
// https://en.wikipedia.org/w/api.php?action=query&prop=imageinfo&iiprop=extmetadata&titles=File%3aBlue_jay_in_PP_%2830960%29.jpg&format=json
// See separate json file for example response.
// Example attribution: By Rhododendrites - Own work, CC BY-SA 4.0, https://commons.wikimedia.org/w/index.php?curid=103770921
// query.pages.value.-1.imageinfo.extmetadata. -> Artist.value (tag value) + Credit + LicenseShortName + ?
function fetchImageUrl(pageTitle) {
    return __awaiter(this, void 0, void 0, function () {
        var client, url, response, source, fieldFn;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (pageTitle.length < 2) {
                        return [2 /*return*/, Promise.reject('Page title to get main image for must have at least two characters')];
                    }
                    client = new rm.RestClient(USER_AGENT);
                    url = "http://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=".concat(pageTitle);
                    return [4 /*yield*/, client.get(url)];
                case 1:
                    response = _a.sent();
                    if (response.statusCode !== 200) {
                        return [2 /*return*/, Promise.reject("Unexpected status code received for url ".concat(url, " : ").concat(response.statusCode))];
                    }
                    if (!response.result) {
                        return [2 /*return*/, Promise.reject("No result found for url ".concat(url))];
                    }
                    source = "";
                    fieldFn = function (key, value) {
                        if (key === 'source') {
                            source = value;
                            return true;
                        }
                        return false;
                    };
                    traverse(response.result, fieldFn);
                    if (source.length <= 0) {
                        return [2 /*return*/, Promise.reject("Could not find main image URL: source field is either not present or value is empty")];
                    }
                    console.log("Found main image URL ".concat(source));
                    return [2 /*return*/, source];
            }
        });
    });
}
function fetchAttribution(imageUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var start, fileName, url, client, response, artist, credit, license, fieldFn;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!imageUrl) {
                        return [2 /*return*/, Promise.reject('Image URL to fetch attribution for must not be empty')];
                    }
                    start = imageUrl.lastIndexOf('/');
                    if (start < 0 || (start + 1 >= imageUrl.length - 1)) {
                        return [2 /*return*/, Promise.reject("Could not find file name in URL ".concat(imageUrl))];
                    }
                    fileName = imageUrl.substring(start + 1);
                    if (!fileName) {
                        return [2 /*return*/, Promise.reject("Could not find file name in URL ".concat(imageUrl))];
                    }
                    console.log("Fetching attribution for ".concat(fileName));
                    url = "https://en.wikipedia.org/w/api.php?action=query&prop=imageinfo&iiprop=extmetadata&titles=File%3a".concat(fileName, "&format=json");
                    client = new rm.RestClient(USER_AGENT);
                    return [4 /*yield*/, client.get(url)];
                case 1:
                    response = _a.sent();
                    if (response.statusCode !== 200) {
                        return [2 /*return*/, Promise.reject("Unexpected status code received for url ".concat(url, " : ").concat(response.statusCode))];
                    }
                    if (!response.result) {
                        return [2 /*return*/, Promise.reject("No result found for url ".concat(url))];
                    }
                    artist = "";
                    credit = "";
                    license = "";
                    fieldFn = function (key, value) {
                        if (key === 'Artist') {
                            var regex = /<a.*>(.*)<\/a>/g;
                            var result = regex.exec(value.value);
                            artist = result ? result[1] : "";
                        }
                        else if (key === 'Credit') {
                            var regex = /<span.*>(.*)<\/span>/g;
                            var result = regex.exec(value.value);
                            credit = result ? result[1] : "";
                        }
                        else if (key === 'LicenseShortName') {
                            license = value.value;
                        }
                        if (artist && credit && license) {
                            return true;
                        }
                        return false;
                    };
                    traverse(response.result, fieldFn);
                    if (artist.length <= 0) {
                        return [2 /*return*/, Promise.reject("Could not find artist: field is either not present or value is empty")];
                    }
                    if (credit.length <= 0) {
                        return [2 /*return*/, Promise.reject("Could not find credit: field is either not present or value is empty")];
                    }
                    if (license.length <= 0) {
                        return [2 /*return*/, Promise.reject("Could not find license: field is either not present or value is empty")];
                    }
                    console.log("Found attribution ".concat(artist, " / ").concat(credit, " / ").concat(license));
                    return [2 /*return*/, { artist: artist, credit: credit, license: license }];
            }
        });
    });
}
function downloadImage(targetDir, url, title) {
    return __awaiter(this, void 0, void 0, function () {
        var fileName, filePath, file;
        return __generator(this, function (_a) {
            if (!title || title.trim().length < 2) {
                return [2 /*return*/, Promise.reject('Title to use in file name must have at least two characters')];
            }
            if (!url) {
                return [2 /*return*/, Promise.reject('URL to fetch image from must not be empty')];
            }
            fileName = title.trim().replace(/(\s+)/g, '_').toLowerCase();
            filePath = "".concat(targetDir, "/").concat(fileName, ".jpg");
            file = fs.createWriteStream(filePath);
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    https.get(url, CLIENT_OPTIONS, function (response) {
                        if (response.statusCode !== 200) {
                            reject("Unexpected status code received for url ".concat(url, " : ").concat(response.statusCode));
                            file.close();
                            return;
                        }
                        response.pipe(file);
                        file.on('finish', function () {
                            file.close();
                            console.log("Downloaded ".concat(filePath));
                            resolve();
                        });
                    });
                })];
        });
    });
}
function traverse(obj, fieldFn) {
    for (var key in obj) {
        var value = obj[key];
        if (!value) {
            continue;
        }
        var stop_1 = fieldFn(key, value);
        if (stop_1) {
            break;
        }
        else if (typeof (value) === 'object') {
            traverse(value, fieldFn);
        }
    }
}
function fetchPageTitle(term) {
    return __awaiter(this, void 0, void 0, function () {
        var client, queryTerm, url, response, title;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (term.trim().length < 2) {
                        return [2 /*return*/, Promise.reject('Page to search for must have at least two characters')];
                    }
                    client = new rm.RestClient(USER_AGENT);
                    queryTerm = term.trim().replace(/(\s{1})/g, '%20');
                    url = "https://en.wikipedia.org/w/api.php?action=opensearch&search=".concat(queryTerm, "&limit=1&namespace=*&format=json");
                    console.log("Searching for ".concat(queryTerm));
                    return [4 /*yield*/, client.get(url)];
                case 1:
                    response = _a.sent();
                    if (response.statusCode !== 200) {
                        return [2 /*return*/, Promise.reject("Unexpected status code received for url ".concat(url, " : ").concat(response.statusCode))];
                    }
                    if (!response.result || response.result.length < 2 || response.result[1].length < 1) {
                        return [2 /*return*/, Promise.reject("No result found for url ".concat(url))];
                    }
                    title = response.result[1][0];
                    console.log("Found title ".concat(title));
                    return [2 /*return*/, title];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var title, url, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, fetchPageTitle('Blue jay')];
                case 1:
                    title = _a.sent();
                    return [4 /*yield*/, fetchImageUrl(title)];
                case 2:
                    url = _a.sent();
                    return [4 /*yield*/, downloadImage('/home/bisensee', url, 'Blue jay')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, fetchAttribution('https://upload.wikimedia.org/wikipedia/commons/f/f4/Blue_jay_in_PP_%2830960%29.jpg')];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _a.sent();
                    console.error(err_1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
main();
