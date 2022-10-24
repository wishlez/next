export type QueryValue = number | string | string[];

export type Query = Record<string, QueryValue>

export type WithQuery<P = Record> = P & {
    query: Query
}

export type ParseQueryNumber = (number: number | string) => number;

export type ParseQueryNumbers = (numbers: string[]) => number[];
