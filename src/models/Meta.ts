
export interface SoundMeta {
    fileName: string;
    fileUrl: string;
    length: string;
    recordist: string;
    url: string;
    licenseUrl: string;
}

export interface ImageMeta {
    fileName: string;
    fileUrl: string;
    article: string;
    artist: string;
    license: string;
}

export interface Bird {
    name: string;
    image: ImageMeta;
    sound: SoundMeta;
}