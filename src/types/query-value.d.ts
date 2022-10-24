export type QueryValue = number | string | string[];

export type Query = Record<string, QueryValue>

export type WithQuery<P = Record> = P & {
    query: Query
}
