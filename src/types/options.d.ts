import {ReactElement} from 'react';

export type AdjustedOptions<T = number> = {
    added: T[]
    deleted: T[]
};

export type GetAdjustedOptions = <T = number>(existingOptions: T[], updatedOptions: T[]) => AdjustedOptions<T>

export type GetOptions = <T>(item: T[], label: keyof T, value: keyof T) => ReactElement[]
