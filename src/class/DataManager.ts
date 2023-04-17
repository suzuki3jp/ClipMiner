import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

export class DataManger {
    _paths: {
        env: string;
        settings: string;
    };

    constructor() {
        this._paths = {
            env: path.resolve(__dirname, '../../.env'),
            settings: path.resolve(__dirname, '../../data/settings.json'),
        };
    }

    setEnv(data: string) {
        this._writeFile(this._paths.env, data);
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

type JsonTypes = SettingsJson;

interface SettingsJson {
    twitch: {
        /**
         * Name of the chat channel to connect to.
         */
        channels: string[];
    };
}
