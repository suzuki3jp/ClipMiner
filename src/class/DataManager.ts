import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

export class DataManger {
    _paths: {
        clips: string;
        env: string;
        settings: string;
    };

    constructor() {
        this._paths = {
            clips: path.resolve(__dirname, '../../data/clips.json'),
            env: path.resolve(__dirname, '../../.env'),
            settings: path.resolve(__dirname, '../../data/settings.json'),
        };
    }

    setEnv(data: string) {
        this._writeFile(this._paths.env, data);
    }

    getClips(): ClipsJson {
        return this._readFile(this._paths.clips);
    }

    setClips(data: string | ClipsJson) {
        this._writeFile(this._paths.clips, data);
    }

    getSettings(): SettingsJson {
        return this._readFile(this._paths.settings);
    }

    setSettings(data: string | SettingsJson) {
        this._writeFile(this._paths.settings, data);
    }

    _readFile(path: string) {
        return JSON.parse(readFileSync(path, 'utf-8'));
    }

    _writeFile(path: string, data: string | JsonTypes) {
        if (typeof data !== 'string') {
            writeFileSync(path, this._jsonToString(data), 'utf-8');
        } else {
            writeFileSync(path, data, 'utf-8');
        }
    }

    _jsonToString(data: any): string {
        return JSON.stringify(data, null, '\t');
    }
}

type JsonTypes = SettingsJson | ClipsJson;

interface SettingsJson {
    twitch: {
        /**
         * Name of the chat channel to connect to.
         */
        channels: string[];
    };
}

interface ClipsJson {
    clips: Clip[];
}

export interface Clip {
    id: string;
    sent_at: string;
    sent_in: string;
}
