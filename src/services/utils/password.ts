import {createHash} from 'crypto';

const nHash = (data: string, algorithms: string[], n = 0): string => {
    if (!algorithms[n]) {
        return data;
    }

    return nHash(createHash(algorithms[n]).update(data).digest().toString('hex'), algorithms, n + 1);
};

export const encryptPassword = (password: string): string => nHash(password, ['sha256', 'md5']);
