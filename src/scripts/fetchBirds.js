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
var fetchWiki_1 = require("./fetchWiki");
var fetchXeno_1 = require("./fetchXeno");
var fs = require("fs");
var path = require("path");
var TARGET_DIR = '/home/bisensee/repos/birds/download_test';
var birds = ['Blue jay', 'Black-browned albatross', 'Northern cardinal', 'Peregrine falcon', 'Pileated woodpecker', 'Short-eared owl'];
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var entries, failed, _a, _b, _c, _i, index, bird, image, sound, exception_1, imagePath, soundPath, indexFile;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    console.log("Starting bird fetching");
                    entries = [];
                    failed = [];
                    _a = birds;
                    _b = [];
                    for (_c in _a)
                        _b.push(_c);
                    _i = 0;
                    _d.label = 1;
                case 1:
                    if (!(_i < _b.length)) return [3 /*break*/, 7];
                    _c = _b[_i];
                    if (!(_c in _a)) return [3 /*break*/, 6];
                    index = _c;
                    bird = birds[index];
                    image = null;
                    sound = null;
                    _d.label = 2;
                case 2:
                    _d.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, (0, fetchWiki_1["default"])(bird, TARGET_DIR)];
                case 3:
                    image = _d.sent();
                    return [4 /*yield*/, (0, fetchXeno_1["default"])(bird, TARGET_DIR)];
                case 4:
                    sound = _d.sent();
                    entries.push({ name: bird, image: image, sound: sound });
                    return [3 /*break*/, 6];
                case 5:
                    exception_1 = _d.sent();
                    console.error("Fetching failed for ".concat(bird, ": ").concat(exception_1));
                    failed.push({ name: bird, error: "".concat(exception_1) });
                    // Cleanup possibly downloaded files to avoid inconsistencies.
                    if (image && image.fileName) {
                        imagePath = path.join(TARGET_DIR, image.fileName);
                        console.log("Removing ".concat(imagePath, " due to fetch error"));
                        fs.unlinkSync(imagePath);
                    }
                    if (sound && sound.fileName) {
                        soundPath = path.join(TARGET_DIR, sound.fileName);
                        console.log("Removing ".concat(soundPath, " due to fetch error"));
                        fs.unlinkSync(soundPath);
                    }
                    return [3 /*break*/, 6];
                case 6:
                    _i++;
                    return [3 /*break*/, 1];
                case 7:
                    console.log("");
                    console.log("Fetching done");
                    console.log("Failed downloads:");
                    console.log(failed);
                    console.log("");
                    console.log("Writing index file");
                    indexFile = path.join(TARGET_DIR, 'birds.json');
                    fs.writeFileSync(indexFile, JSON.stringify(entries, null, 4), 'utf-8');
                    console.log("Finished bird fetching");
                    return [2 /*return*/];
            }
        });
    });
}
main();
