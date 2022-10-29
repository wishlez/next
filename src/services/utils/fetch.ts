import {Query} from '../../types/query';

type LoadedMethod = 'POST' | 'PUT' | 'PATCH';
type QueriedMethod = 'GET' | 'DELETE';

type Payload = Record<any, any>;

type LoadedFetch = <T>(url: string, payload: Payload, method: LoadedMethod) => Promise<T>;
type QueriedFetch = <T>(url: string, payload: Query, method: QueriedMethod) => Promise<T>;

type DoLoadedFetch = <T>(url: string, payload: Payload) => Promise<T>;
type DoQueriedFetch = <T>(url: string, query: Query) => Promise<T>;

interface ResponseErrorType extends Error {
    info: any,
    status: number,
}

class ResponseError extends Error implements ResponseErrorType {
    info: any;
    status: number;

    constructor() {
        super('An error occurred while fetching the data');
    }

    async setInformation(response: Response): Promise<void> {
        this.info = await response.json();
        this.status = response.status;
    }
}

const serializeQuery = (query: Query): string[][] => {
    return Object.entries(query).reduce((params, [key, value]) => {
        if (typeof value === 'number') {
            return params.concat([[key, value.toString()]]);
        } else if (Array.isArray(value)) {
            return params.concat(value.map((val) => [key, val]));
        } else if (!value) {
            return params;
        } else {
            return params.concat([[key, value]]);
        }
    }, []);
};

const toParams = (query: Query): string => {
    const params = new URLSearchParams(serializeQuery(query ?? {})).toString();

    return params ? `?${params}` : '';
};

const fetcher = async <T>(url: string, options?: RequestInit): Promise<T> => {
    const response = await fetch(url, options);

    if (!response.ok) {
        const error = new ResponseError();

        await error.setInformation(response);

        throw error;
    }

    return response.json();
};

const loadedFetch: LoadedFetch = (url, payload, method) => fetcher(url, {
    body: JSON.stringify(payload),
    headers: {
        'Content-type': 'application/json'
    },
    method
});

const queriedFetch: QueriedFetch = (url, query, method) => fetcher(`${url}${toParams(query)}`, {
    headers: {
        Accept: 'application/json'
    },
    method
});

export const doPost: DoLoadedFetch = (url, payload) => loadedFetch(url, payload, 'POST');
export const doPut: DoLoadedFetch = (url, payload) => loadedFetch(url, payload, 'PUT');
export const doPatch: DoLoadedFetch = (url, payload) => loadedFetch(url, payload, 'PATCH');

export const doGet: DoQueriedFetch = (url, query) => queriedFetch(url, query, 'GET');
export const doDelete: DoQueriedFetch = (url, query) => queriedFetch(url, query, 'DELETE');
